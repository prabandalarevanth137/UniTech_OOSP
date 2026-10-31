# UniTech_OOSP
Denying Writes to Executables
A Linux/C project demonstrating how write permissions on executable files can be restricted and then restored using POSIX file-permission operations.

Table of Contents
- Introduction
- Problem Statement
- Objectives
- Project Overview
- Project Flow
- Technologies and System Calls
- Project Structure
- Requirements
- Build and Run
- Testing and Results
- Website and Screenshots
- Limitations and Security Notes
- Conclusion
Introduction
Executable files are important parts of a Linux system. If an executable can be modified by an unauthorized user, its contents may be changed and the program's integrity may be affected. Linux file permissions provide a basic way to control who can read, write, or execute a file.

Denying Writes to Executables is a C project that demonstrates a permission-based approach: inspect a file's permissions, temporarily remove write permission bits, attempt a write operation, and restore the original permissions afterward. The project also includes test cases and a static website with an interactive permission simulator for learning purposes.
Problem Statement
A file that is executable may also have write permissions. Those write permissions can allow a user with sufficient access to modify the file. The project explores how a program can remove the file's write permission bits before attempting a write, check the result, and restore the original mode.
Objectives
- Inspect file metadata and permission bits.
- Identify whether a file has executable permission bits.
- Save the original permission mode before making changes.
- Remove write permission bits using chmod().
- Attempt a write operation and check whether it is denied.
- Restore the original permission mode after the test.
- Validate the expected behavior with automated test cases.
- Explain the process through a browser-based project website.
Project Overview
At a high level, the program works with a target file and its permission mode. It uses POSIX system calls to inspect and change permissions, attempts a write, reports the result, and restores the saved mode.

The website is a learning/demo interface. Its browser-based permission simulator illustrates permission changes only; it does not change permissions on real files on your computer.
Project Flow
                  START
                    |
                    v
          Select the target file
                    |
                    v
          Read file metadata (stat)
                    |
                    v
       Check executable permission bits
                    |
                    v
       Save the original permission mode
                    |
                    v
       Remove write bits using chmod()
                    |
                    v
       Open file and attempt a write
                    |
                    v
       Was the write operation denied?
              /             \\
            Yes              No
             |                |
             v                v
      Report denial     Report the result
              \\             /
               v           v
          Restore original mode
                    |
                    v
          Report test outcome
                    |
                    v
                   END
Important: the exact result of a write attempt depends on the file, the running user's privileges, filesystem behavior, ACLs, and other system policy. The program should always check system-call return values and handle errors.
Technologies and System Calls
- C — implementation language.
- Linux / POSIX APIs — file and permission operations.
- stat() — obtains file metadata, including mode bits.
- chmod() — changes file permission bits.
- open() — opens the target file.
- write() — attempts to write data to the file.
- close() — closes the file descriptor.
- Bash — runs the automated test script.
- HTML, CSS, JavaScript — project information website and browser-side demo.
Project Structure
The repository currently includes the following key items:
Denying_Writes_to_Executables/
├── Test_Cases/
├── src/
├── README.md
├── index.html
├── style.css
└── script.js
- src/ — C source code and test/run support files.
- Test_Cases/ — project test cases.
- index.html — website structure and content.
- style.css — website layout and visual styling.
- script.js — browser-side interactive behavior.
- README.md — project documentation.
Requirements
- A Linux environment or compatible POSIX environment.
- A C compiler such as GCC.
- Bash to run the provided test script.
- A browser to view the static website.
Build and Run
From the project directory, run the automated test script:
cd ~/Denying_Writes_to_Executables
bash src/test.sh
If your project is stored in a different location, change the cd path accordingly.

To compile manually, first inspect the source files in src/ and use the actual C source filename. For example:
gcc -Wall -Wextra -o deny_writes src/<source_file>.c
Replace <source_file>.c with the real filename in your repository. Run the compiled program only with a test file you are allowed to modify, and keep a backup of important files.

To view the website locally, open index.html in a browser. No web framework is required for the static site.
Testing and Results
The automated test run recorded for this project reported that all five permission tests passed:
1. Checking executable permission — PASS
2. Checking initial write permission — PASS
3. Removing write permission — PASS
4. Verifying write denial — PASS
5. Restoring permissions — PASS
The test output reported: “All automated permission tests passed.”
Example permission change
For a file with mode 0754, removing all write bits results in mode 0554:
Mode	Owner	Group	Others
0754	Read, write, execute	Read, execute	Read
0554	Read, execute	Read, execute	Read


This is an illustrative example. The actual mode depends on the target file's original permissions.
Website
The project website includes an overview, a workflow explanation, an interactive permission simulator, a POSIX system-call explorer, a permission calculator, run instructions, and security limitations.

To view the static website locally, open index.html in a web browser. The browser-based simulator is for learning and does not change permissions on real files.
Limitations and Security Notes
- This project demonstrates ordinary Unix permission-bit behavior; it is not a complete executable-integrity security system.
- Removing write bits with chmod() does not prevent every possible modification. A privileged process (such as root), ACLs, capabilities, filesystem policies, or other mechanisms may change the outcome.
- Permission changes affect the real target file when the C program is run. Test only on a disposable file you own or are authorized to modify.
- The original mode should be restored even when errors occur. Production-quality code should handle failures carefully and use appropriate cleanup paths.
- The website's simulator is browser-only and does not modify real files.
Conclusion
This project demonstrates how Linux permission bits and POSIX system calls can be used to restrict ordinary write access to an executable during a test, verify the result, and restore the original permissions. It combines a C implementation, automated tests, and a static learning website to make the concept easier to understand.
Project: Denying Writes to Executables
Language: C
Environment: Linux / POSIX
