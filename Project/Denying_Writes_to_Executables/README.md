# Denying Writes to Executables

## Project Overview

Denying Writes to Executables is a Linux-based system programming project that demonstrates how executable files can be protected from unwanted modifications using Linux file permissions.

The project identifies executable files, checks their permissions, removes write permission when protection is required, and tests whether a write operation is allowed or denied.

## Team Members

- P. Revanth - 2520030292
- E. Akhil - 2520030507

## Objectives

- Understand Linux file permissions and access control.
- Identify executable files.
- Inspect file information using `stat()`.
- Restrict write permissions using `chmod()`.
- Test write operations using `open()` and `write()`.
- Handle permission errors using `errno`.
- Understand file descriptors and Linux/POSIX system calls.

## Technologies Used

- Linux / Ubuntu
- C Programming
- GCC Compiler
- Linux/POSIX System Calls
- Terminal / VS Code

## Linux/POSIX APIs Used

| API | Purpose |
|---|---|
| `stat()` | Obtains file information and permissions |
| `chmod()` | Changes file permissions |
| `open()` | Opens a file with a requested access mode |
| `write()` | Attempts to write data to the file |
| `close()` | Closes the file descriptor |
| `errno` | Provides information about system call errors |

## Working

1. The user enters the executable file path.
2. The program uses `stat()` to inspect the file.
3. The program checks whether the file has execute permission.
4. The current read, write, and execute permissions are displayed.
5. The program removes write permission using `chmod()`.
6. The program attempts to write to the protected file.
7. Linux denies the write operation when write permission is unavailable.
8. The program displays the error using `errno` and `strerror()`.
9. The original permissions are restored.

## Compilation

Enter the `src` directory:

```bash
cd src
