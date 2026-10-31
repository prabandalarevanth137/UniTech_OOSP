# Denying Writes to Executables

## 1. Introduction

Executable files are important components of a Linux operating system. If an executable file can be modified by an unauthorized user, its contents may be changed, potentially affecting the integrity and security of the program.

Linux provides file permissions to control who can read, write, and execute files.

**Denying Writes to Executables** is a C-based project that demonstrates how write permissions can be temporarily removed from an executable file, how a write operation can be tested, and how the original permissions can be restored afterward.

The project uses POSIX system calls and includes automated test cases and a website that explains the concepts interactively.

## 2. Problem Statement

Executable files may have both execution and write permissions. If a user has sufficient access to modify such a file, its contents can be changed.

The objective of this project is to demonstrate how a program can inspect file permissions, remove write permission bits, attempt a write operation, verify the result, and restore the original permissions.

## 3. Objectives

- To understand Linux file permissions.
- To identify executable permission bits.
- To inspect file metadata using `stat()`.
- To save the original file permission mode.
- To remove write permissions using `chmod()`.
- To attempt a write operation using `open()` and `write()`.
- To verify whether the write operation is denied.
- To restore the original permissions.
- To test the program using automated test cases.
- To provide an interactive website for understanding the project.

## 4. Project Overview

The project demonstrates a permission-based approach to restricting ordinary write access to executable files.

The program examines a target file, saves its original permissions, removes the write permission bits, attempts a write operation, checks the result, and restores the original permission mode.

The project also includes a static website that explains the workflow, POSIX system calls, file permission modes, and security limitations.

## 5. Project Flow

The project follows these steps:

1. **Start the program** — select the target file.
2. **Inspect the file** — use `stat()` to obtain file metadata.
3. **Check executable permissions** — determine whether executable permission bits are set.
4. **Save the original permissions** — preserve the original permission mode.
5. **Remove write permissions** — use `chmod()` to remove the write bits.
6. **Attempt a write operation** — open the file and try to write data.
7. **Check the result** — determine whether the write operation succeeded or was denied.
8. **Restore permissions** — restore the original permission mode.
9. **Display the result** — report the outcome of the test.

### Flowchart

```text
          START
            |
            v
      Select target file
            |
            v
     Inspect file using stat()
            |
            v
   Check executable permissions
            |
            v
   Save original permission mode
            |
            v
    Remove write bits using chmod()
            |
            v
    Attempt write using open()/write()
            |
            v
      Check write result
            |
            v
   Restore original permissions
            |
            v
      Display test result
            |
            v
           END
```

## 6. Technologies Used

- **C Programming Language:** Implements the permission-handling logic.
- **Linux:** Provides the operating-system environment.
- **POSIX System Calls:** Used for file metadata, permissions, and file operations.
- **Bash:** Runs the automated test script.
- **HTML:** Defines the website structure.
- **CSS:** Provides website styling and layout.
- **JavaScript:** Supports interactive website features.
- **GitHub:** Stores and shares the project source code and website files.

## 7. System Calls Used

| System Call | Purpose |
|---|---|
| `stat()` | Retrieves file metadata and permission bits. |
| `chmod()` | Changes file permission bits. |
| `open()` | Opens a file for an operation. |
| `write()` | Attempts to write data to a file. |
| `close()` | Closes an open file descriptor. |

## 8. Project Structure

```text
Denying_Writes_to_Executables/
│
├── Test_Cases/
│   └── Project test cases
│
├── src/
│   └── C source code and test support files
│
├── README.md
├── index.html
├── style.css
└── script.js
```

### File Description

- **src/** — contains the C source code and related support files.
- **Test_Cases/** — contains the project's test cases.
- **README.md** — provides project documentation.
- **index.html** — contains the website structure and content.
- **style.css** — controls the website's appearance.
- **script.js** — implements interactive website behavior.

## 9. Requirements

The project requires:

- A Linux or compatible POSIX environment.
- A C compiler such as GCC.
- Bash to run the test script.
- A web browser to view the project website.

## 10. How to Run the Project

Open a terminal and navigate to the project directory.

Run the automated test script:

```bash
cd ~/Denying_Writes_to_Executables
bash src/test.sh
```

If your project is saved in a different location, replace the directory path with your actual project location.

To view the website, open `index.html` in a web browser.

**Note:** Run permission-changing tests only on files you own or are authorized to modify. Use a disposable test file rather than an important executable.

## 11. Testing and Results

The automated test run recorded for this project reported that all five permission tests passed.

| Test No. | Test Description | Result |
|---|---|---|
| 1 | Checking executable permission | PASS |
| 2 | Checking initial write permission | PASS |
| 3 | Removing write permission | PASS |
| 4 | Verifying write denial | PASS |
| 5 | Restoring permissions | PASS |

**Final Result:** All automated permission tests passed.

## 12. Example of Permission Changes

Consider a file with permission mode `0754`.

| Permission Mode | Owner | Group | Others |
|---|---|---|---|
| `0754` | Read, write, execute | Read, execute | Read |
| `0554` | Read, execute | Read, execute | Read |

In this example, changing the mode from `0754` to `0554` removes the write permission bits while preserving the other permission bits.

The actual permission mode depends on the target file's original permissions.

## 13. Website Overview

The project website provides an interactive way to understand the concepts behind the implementation.

Its features include:

- Project introduction and overview.
- Explanation of the project workflow.
- Interactive file-permission simulator.
- POSIX system-call explanations.
- Permission-mode calculator.
- Build and execution instructions.
- Security limitations and considerations.

The website's permission simulator is a browser-based demonstration. It does not change permissions on real files.

## 14. Limitations and Security Considerations

- Removing write permission bits is not a complete executable-integrity security solution.
- A privileged user, such as root, may still be able to modify file permissions or file contents.
- Access-control lists, filesystem policies, and other security mechanisms can affect the outcome.
- The program must check system-call return values and handle errors properly.
- The original permission mode should be restored even when an operation fails.
- Permission-changing tests should be performed only on files that the user is authorized to modify.

## 15. Conclusion

The **Denying Writes to Executables** project demonstrates how Linux file permissions and POSIX system calls can be used to inspect file permissions, remove write permission bits, attempt a write operation, verify the result, and restore the original permissions.

The project combines C programming, Linux file-permission concepts, automated testing, and an interactive website to provide a practical learning experience.

## 16. Project Information

- **Project Name:** Denying Writes to Executables
- **Programming Language:** C
- **Operating System:** Linux
- **APIs:** POSIX system calls
- **Website Technologies:** HTML, CSS, JavaScript
- **Testing:** Bash automated test script
