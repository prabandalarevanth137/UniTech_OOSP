# Denying Writes to Executables

A static cybersecurity project site about Linux file permissions, C, and POSIX system calls. It includes a browser-side permission simulator and octal-to-symbolic permission calculator.

## Preview

Open `index.html` directly in a browser, or open this folder in VS Code and use the Live Server extension (`Open with Live Server`). There is no build step, backend, or package installation. Google Fonts are loaded online; fallback system fonts are used offline.

## Files

- `index.html` — page structure and project content
- `style.css` — responsive visual design and component styles
- `script.js` — simulator, calculator, mobile navigation, and copy buttons
- `README.md` — setup and usage instructions

## Permission lab

The simulator starts at `754` (`rwxr-xr--`). Removing all write bits applies the `0222` mask and changes the mode to `554` (`r-xr-xr--`). The simulated write control checks the owner-write bit. Reset returns the model to `754`. Neither interactive tool accesses files or runs the C program.

The calculator accepts exactly three digits from `0` through `7`, converts valid octal modes to symbolic permissions, and reports invalid input.

## Compile and run a C implementation

These example commands assume that you have created `permission_check.c` and have GCC on Linux:

```sh
gcc -Wall -Wextra -o permission_check permission_check.c
./permission_check ./target.bin
```

The website contains illustrative snippets only; it does not supply or execute a C implementation. Run a program only against files you are authorized to inspect. A complete implementation should preserve and safely restore the original mode, check system-call return values, and account for ownership, privileges, ACLs, and other access controls.
