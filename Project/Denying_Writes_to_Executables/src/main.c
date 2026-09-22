#include <stdio.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>
#include <errno.h>
#include <string.h>

void show_permissions(mode_t mode)
{
    printf("Permissions: ");

    printf((mode & S_IRUSR) ? "r" : "-");
    printf((mode & S_IWUSR) ? "w" : "-");
    printf((mode & S_IXUSR) ? "x" : "-");

    printf((mode & S_IRGRP) ? "r" : "-");
    printf((mode & S_IWGRP) ? "w" : "-");
    printf((mode & S_IXGRP) ? "x" : "-");

    printf((mode & S_IROTH) ? "r" : "-");
    printf((mode & S_IWOTH) ? "w" : "-");
    printf((mode & S_IXOTH) ? "x" : "-");

    printf("\n");
}

int main()
{
    char path[256];
    struct stat file_info;
    mode_t original_mode;
    int choice;
    int fd;
    const char message[] = "# Write test\n";

    printf("========================================\n");
    printf("     DENYING WRITES TO EXECUTABLES\n");
    printf("========================================\n");

    printf("\nEnter executable file path: ");
    scanf("%255s", path);

    /* Get file information */
    if (stat(path, &file_info) == -1)
    {
        perror("stat");
        return 1;
    }

    original_mode = file_info.st_mode & 0777;

    while (1)
    {
        printf("\n========== MENU ==========\n");
        printf("1. Check executable\n");
        printf("2. Show permissions\n");
        printf("3. Deny write permission\n");
        printf("4. Test write operation\n");
        printf("5. Restore permissions\n");
        printf("6. Exit\n");
        printf("===========================\n");

        printf("Enter your choice: ");
        scanf("%d", &choice);

        switch (choice)
        {
            case 1:

                if (file_info.st_mode &
                    (S_IXUSR | S_IXGRP | S_IXOTH))
                {
                    printf("\nExecutable: YES\n");
                }
                else
                {
                    printf("\nExecutable: NO\n");
                }

                break;

            case 2:

                if (stat(path, &file_info) == -1)
                {
                    perror("stat");
                    break;
                }

                show_permissions(file_info.st_mode);

                break;

            case 3:

                if (chmod(path,
                    original_mode &
                    ~(S_IWUSR | S_IWGRP | S_IWOTH)) == -1)
                {
                    perror("chmod");
                }
                else
                {
                    printf("\nWrite permission denied successfully.\n");

                    stat(path, &file_info);
                    show_permissions(file_info.st_mode);
                }

                break;

            case 4:

                printf("\nTrying to write to the file...\n");

                fd = open(path, O_WRONLY | O_APPEND);

                if (fd == -1)
                {
                    printf("Write access: DENIED\n");
                    printf("Reason: %s\n", strerror(errno));
                }
                else
                {
                    if (write(fd, message,
                              sizeof(message) - 1) == -1)
                    {
                        printf("Write access: DENIED\n");
                        printf("Reason: %s\n", strerror(errno));
                    }
                    else
                    {
                        printf("Write access: ALLOWED\n");
                        printf("Write operation completed.\n");
                    }

                    close(fd);
                }

                break;

            case 5:

                if (chmod(path, original_mode) == -1)
                {
                    perror("chmod");
                }
                else
                {
                    printf("\nOriginal permissions restored.\n");

                    stat(path, &file_info);
                    show_permissions(file_info.st_mode);
                }

                break;

            case 6:

                printf("\nExiting program...\n");
                return 0;

            default:

                printf("\nInvalid choice. Please try again.\n");
        }
    }

    return 0;
}
