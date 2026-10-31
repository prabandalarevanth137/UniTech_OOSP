(() => {
  'use strict';
  const NAMES = ['owner', 'group', 'others'];
  const SYMBOLS = ['---', '--x', '-w-', '-wx', 'r--', 'r-x', 'rw-', 'rwx'];
  const initialMode = 0o754;
  let mode = initialMode;

  const octalElement = document.getElementById('lab-octal');
  const symbolicElement = document.getElementById('lab-symbolic');
  const outputElement = document.getElementById('lab-output');
  const stateElement = document.getElementById('lab-state');
  const groupContainer = document.getElementById('permission-groups');
  const permissionForm = document.getElementById('permission-form');
  const permissionInput = document.getElementById('permission-input');
  const calculatorMessage = document.getElementById('calculator-message');
  const calculatorResult = document.getElementById('calculator-result');
  const copyFeedback = document.getElementById('copy-feedback');
  const apiContent = {
    stat: ['stat() — inspect metadata', 'stat() reads metadata for a path into struct stat. Use st_mode to inspect permission bits, and check for a return value of -1 before using the result.', 'struct stat info;\nif (stat(path, &info) == -1) {\n    perror("stat");\n}'],
    chmod: ['chmod() — change permissions', 'chmod() applies a new permission mode to a path. Save the original mode first, check the return value, and remember that ownership and privilege affect whether the change is allowed.', 'mode_t original = info.st_mode & 0777;\nif (chmod(path, original & ~0222) == -1) {\n    perror("chmod");\n}'],
    open: ['open() — request access', 'open() asks the kernel to open a path with flags. O_WRONLY requests write access; failure returns -1 and sets errno.', 'int fd = open(path, O_WRONLY);\nif (fd == -1) {\n    /* inspect errno */\n}'],
    write: ['write() — write bytes', 'write() attempts to transfer bytes through a descriptor. It can fail or write fewer bytes than requested, so production code must handle both cases.', 'ssize_t count = write(fd, data, length);\nif (count == -1) {\n    perror("write");\n}'],
    close: ['close() — release a descriptor', 'close() releases a descriptor after use. Check its result: some write errors can be reported only when buffered data is finalized.', 'if (close(fd) == -1) {\n    perror("close");\n}'],
    errno: ['errno — inspect the failure code', 'A system call commonly reports failure with -1 and sets errno. Capture errno immediately after the failing call, before calling functions that may change it.', 'if (fd == -1) {\n    int saved_error = errno;\n    /* use saved_error */\n}'],
    strerror: ['strerror() — describe an error code', 'strerror() returns a human-readable description for an error number. Pass it a saved errno value when formatting a system-call failure.', 'int saved_error = errno;\nfprintf(stderr, "open: %s\\n",\n        strerror(saved_error));'],
    constants: ['Permission constants — inspect mode bits', 'The S_IRUSR, S_IWUSR, S_IXUSR (and GRP/OTH variants) masks represent read, write, and execute bits. O_WRONLY is an open() flag, not a permission bit. 0222 combines the three write masks.', 'if (info.st_mode & (S_IXUSR | S_IXGRP | S_IXOTH)) {\n    /* at least one execute bit is set */\n}\nmode_t protected = original & ~0222;']
  };

  function toSymbolic(permissionMode) {
    return [6, 3, 0].map(shift => SYMBOLS[(permissionMode >> shift) & 7]).join('');
  }

  function renderLab() {
    const digits = [6, 3, 0].map(shift => (mode >> shift) & 7);
    const symbolic = toSymbolic(mode);
    octalElement.textContent = mode.toString(8).padStart(3, '0');
    symbolicElement.textContent = symbolic;
    if (!groupContainer.children.length) {
      groupContainer.replaceChildren(...digits.map((digit, index) => {
        const group = document.createElement('fieldset');
        group.className = 'permission-group';
        const legend = document.createElement('legend');
        legend.className = 'permission-group-head';
        const name = document.createElement('span');
        name.textContent = NAMES[index].toUpperCase();
        const octal = document.createElement('span');
        octal.dataset.groupOctal = String(index);
        legend.append(name, octal);
        const bits = document.createElement('div');
        bits.className = 'permission-bits';
        [['r', 4], ['w', 2], ['x', 1]].forEach(([letter, value]) => {
          const label = document.createElement('label');
          label.className = 'permission-control';
          const input = document.createElement('input');
          input.type = 'checkbox';
          input.dataset.group = String(index);
          input.dataset.value = String(value);
          input.setAttribute('aria-label', `${NAMES[index]} ${letter === 'r' ? 'read' : letter === 'w' ? 'write' : 'execute'} permission`);
          const bit = document.createElement('span');
          bit.className = 'permission-bit';
          bit.textContent = letter;
          label.append(input, bit);
          bits.append(label);
        });
        group.append(legend, bits);
        return group;
      }));
    }
    groupContainer.querySelectorAll('input[type="checkbox"]').forEach(input => {
      const digit = digits[Number(input.dataset.group)];
      input.checked = Boolean(digit & Number(input.dataset.value));
      input.closest('.permission-control').classList.toggle('is-on', input.checked);
    });
    groupContainer.querySelectorAll('[data-group-octal]').forEach(label => {
      label.textContent = digits[Number(label.dataset.groupOctal)].toString(8);
    });
    NAMES.forEach((name, index) => {
      document.getElementById(`${name}-bits`).textContent = symbolic.slice(index * 3, index * 3 + 3);
      document.getElementById(`${name}-octal`).textContent = digits[index].toString(8);
    });
    const ownerCanWrite = Boolean(mode & 0o200);
    stateElement.classList.toggle('is-protected', !ownerCanWrite);
    stateElement.querySelector('span:last-child').innerHTML = `OWNER WRITE<br><b>${ownerCanWrite ? 'ENABLED' : 'REMOVED'}</b>`;
  }

  function setOutput(message, kind = '') {
    outputElement.classList.toggle('is-denied', kind === 'denied');
    outputElement.classList.toggle('is-success', kind === 'success');
    const mark = document.createElement('span');
    mark.className = 'output-mark';
    mark.textContent = '›';
    const content = document.createElement('span');
    content.textContent = message;
    const model = document.createElement('span');
    model.className = 'output-time';
    model.textContent = 'MODEL';
    outputElement.replaceChildren(mark, content, model);
  }

  document.getElementById('remove-writes').addEventListener('click', () => {
    mode &= ~0o222;
    renderLab();
    setOutput(`Write bits cleared. Current mode is ${mode.toString(8).padStart(3, '0')} (${toSymbolic(mode)}).`);
  });
  document.getElementById('try-write').addEventListener('click', () => {
    if (mode & 0o200) setOutput('Simulated write allowed: owner write permission is present.', 'success');
    else setOutput('Simulated write denied: owner write permission is not present.', 'denied');
  });
  document.getElementById('reset-lab').addEventListener('click', () => {
    mode = initialMode;
    renderLab();
    setOutput('Reset complete. Mode 754 gives the owner write permission.');
  });
  document.getElementById('copy-mode').addEventListener('click', async event => {
    const value = `${mode.toString(8).padStart(3, '0')} ${toSymbolic(mode)}`;
    try {
      await navigator.clipboard.writeText(value);
      const button = event.currentTarget;
      button.textContent = 'Mode copied';
      window.setTimeout(() => { button.textContent = 'Copy current mode'; }, 1400);
    } catch {
      setOutput(`Select and copy the current mode: ${value}`);
    }
  });

  groupContainer.addEventListener('change', event => {
    const input = event.target.closest('input[type="checkbox"]');
    if (!input) return;
    const shift = 6 - Number(input.dataset.group) * 3;
    const bit = Number(input.dataset.value) << shift;
    mode = input.checked ? mode | bit : mode & ~bit;
    renderLab();
    setOutput(`Permission updated. Mode is ${mode.toString(8).padStart(3, '0')} (${toSymbolic(mode)}).`);
  });

  function calculatePermissions(value) {
    if (!/^[0-7]{3}$/.test(value)) return null;
    return [...value].map(digit => SYMBOLS[Number(digit)]).join('');
  }
  permissionForm.addEventListener('submit', event => {
    event.preventDefault();
    const symbolic = calculatePermissions(permissionInput.value.trim());
    const invalid = symbolic === null;
    calculatorResult.textContent = symbolic ?? '—';
    calculatorResult.parentElement.classList.toggle('is-invalid', invalid);
    calculatorMessage.textContent = invalid
      ? 'Invalid mode. Enter exactly three octal digits (0–7), such as 754.'
      : 'Valid octal mode. Digits map to owner, group, and others.';
    calculatorMessage.classList.toggle('is-error', invalid);
    permissionInput.setAttribute('aria-invalid', String(invalid));
  });
  permissionInput.addEventListener('input', () => {
    permissionInput.removeAttribute('aria-invalid');
    calculatorMessage.textContent = 'Press Convert to calculate the symbolic permissions.';
    calculatorMessage.classList.remove('is-error');
  });
  document.querySelectorAll('[data-example-mode]').forEach(button => {
    button.addEventListener('click', () => {
      permissionInput.value = button.dataset.exampleMode;
      permissionForm.requestSubmit();
    });
  });
  document.getElementById('copy-calculation').addEventListener('click', async () => {
    const symbolic = calculatePermissions(permissionInput.value.trim());
    if (symbolic === null) {
      calculatorMessage.textContent = 'Correct the octal mode before copying a result.';
      calculatorMessage.classList.add('is-error');
      permissionInput.focus();
      return;
    }
    const value = `${permissionInput.value} ${symbolic}`;
    try {
      await navigator.clipboard.writeText(value);
      calculatorMessage.textContent = `Copied ${value}`;
    } catch {
      calculatorMessage.textContent = `Clipboard unavailable. Select and copy: ${value}`;
    }
  });

  document.querySelectorAll('[data-api]').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-api]').forEach(item => item.classList.toggle('is-selected', item === button));
      const [title, description, example] = apiContent[button.dataset.api];
      document.getElementById('api-title').textContent = title;
      document.getElementById('api-description').textContent = description;
      document.querySelector('#api-example code').textContent = example;
    });
  });
  document.getElementById('copy-example').addEventListener('click', async event => {
    const snippet = document.querySelector('#api-example code').textContent;
    try {
      await navigator.clipboard.writeText(snippet);
      const button = event.currentTarget;
      button.textContent = 'Copied';
      window.setTimeout(() => { button.textContent = 'Copy snippet'; }, 1400);
    } catch {
      event.currentTarget.textContent = 'Select snippet to copy';
    }
  });

  document.querySelectorAll('.copy-command').forEach(button => {
    button.addEventListener('click', async () => {
      const command = button.dataset.copy;
      try {
        await navigator.clipboard.writeText(command);
        copyFeedback.textContent = `Copied: ${command}`;
      } catch {
        copyFeedback.textContent = `Clipboard unavailable. Select and copy: ${command}`;
      }
    });
  });

  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.getElementById('primary-nav');
  menuButton.addEventListener('click', () => {
    const isOpen = navigation.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });
  navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    navigation.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
  }));

  const searchDialog = document.getElementById('site-search');
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  const searchSections = [
    ['overview', 'Project overview', 'Problem, objectives, and Linux permission model'],
    ['workflow', 'Workflow', 'stat, executable bits, chmod, write attempt, restoration'],
    ['permission-lab', 'Permission lab', 'Interactive owner, group, and others mode controls'],
    ['code', 'C system call explorer', 'stat, chmod, open, write, close, errno, strerror, constants'],
    ['calculator', 'Permission calculator', 'Convert octal permission modes to symbolic form'],
    ['testing', 'Build and run', 'GCC compile command and expected behavior'],
    ['limitations', 'Security limitations', 'Ownership, privileges, ACLs, and access context']
  ];
  function renderSearchResults(query = '') {
    const term = query.trim().toLowerCase();
    const matches = searchSections.filter(([, title, detail]) => `${title} ${detail}`.toLowerCase().includes(term));
    searchResults.replaceChildren();
    if (!matches.length) {
      const empty = document.createElement('p');
      empty.className = 'search-empty';
      empty.textContent = 'No matching sections. Try “permissions”, “C calls”, or “testing”.';
      searchResults.append(empty);
      return;
    }
    matches.forEach(([id, title, detail]) => {
      const link = document.createElement('a');
      link.href = `#${id}`;
      const heading = document.createElement('strong');
      heading.textContent = title;
      const description = document.createElement('span');
      description.textContent = detail;
      link.append(heading, description);
      link.addEventListener('click', () => searchDialog.close());
      searchResults.append(link);
    });
  }
  document.getElementById('open-search').addEventListener('click', () => {
    navigation.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
    renderSearchResults();
    searchDialog.showModal();
    searchInput.value = '';
    searchInput.focus();
  });
  searchInput.addEventListener('input', () => renderSearchResults(searchInput.value));
  document.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      if (!searchDialog.open) document.getElementById('open-search').click();
      else searchInput.focus();
    }
  });
  renderLab();
})();
