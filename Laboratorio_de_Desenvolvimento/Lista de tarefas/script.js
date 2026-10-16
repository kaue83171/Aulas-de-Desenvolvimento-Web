  
    (() => {
      const STORAGE_KEY = 'hoje-em-dia.tasks.v1';
      const labels = { high: 'Alta', medium: 'Média', low: 'Baixa' };
      const form = document.querySelector('#task-form');
      const titleInput = document.querySelector('#task-title');
      const dateInput = document.querySelector('#task-date');
      const list = document.querySelector('#task-list');
      const count = document.querySelector('#task-count');
      const remaining = document.querySelector('#remaining');
      const error = document.querySelector('#form-error');
      let filter = 'all';
      let tasks = loadTasks();

      function loadTasks() {
        try {
          const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
          return Array.isArray(parsed) ? parsed.filter(task => task && typeof task.id === 'string' && typeof task.title === 'string' && ['high', 'medium', 'low'].includes(task.priority)).map(task => ({ id: task.id, title: task.title, priority: task.priority, date: typeof task.date === 'string' ? task.date : '', done: Boolean(task.done) })) : [];
        } catch { return []; }
      }
      function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); }
      function formatDate(value) {
        if (!value) return '';
        const [year, month, day] = value.split('-').map(Number);
        return new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(year, month - 1, day)));
      }
      function dateClass(value, done) {
        if (!value || done) return '';
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const due = new Date(`${value}T00:00:00`);
        if (due < today) return ' overdue';
        if (due.getTime() === today.getTime()) return ' today';
        return '';
      }
      function render() {
        const visible = tasks.filter(task => filter === 'all' || (filter === 'active' && !task.done) || (filter === 'done' && task.done));
        list.replaceChildren();
        if (!visible.length) {
          const empty = document.createElement('div'); empty.className = 'empty';
          const icon = document.createElement('div'); icon.className = 'empty-icon'; icon.textContent = filter === 'done' ? '✓' : '✳';
          const heading = document.createElement('strong'); heading.textContent = tasks.length ? 'Nada por aqui' : 'Tudo começa com uma tarefa';
          const message = document.createElement('p'); message.textContent = tasks.length ? 'Escolha outro filtro para ver suas tarefas.' : 'Adicione uma tarefa ao lado para organizar seu dia.';
          empty.append(icon, heading, message); list.append(empty);
        }
        for (const task of visible) {
          const article = document.createElement('article'); article.className = `task${task.done ? ' done' : ''}`; article.dataset.priority = task.priority;
          const checkbox = document.createElement('input'); checkbox.type = 'checkbox'; checkbox.className = 'check'; checkbox.checked = task.done; checkbox.setAttribute('aria-label', task.done ? `Reabrir: ${task.title}` : `Concluir: ${task.title}`); checkbox.addEventListener('change', () => updateTask(task.id, { done: checkbox.checked }));
          const content = document.createElement('div');
          const name = document.createElement('p'); name.className = 'task-title'; name.textContent = task.title; content.append(name);
          const meta = document.createElement('div'); meta.className = 'task-meta';
          const badge = document.createElement('span'); badge.className = 'tag'; badge.textContent = labels[task.priority]; meta.append(badge);
          if (task.date) { const due = document.createElement('span'); due.className = `due${dateClass(task.date, task.done)}`; due.textContent = `${task.date < new Date().toLocaleDateString('en-CA') && !task.done ? 'Atrasada · ' : ''}Prazo: ${formatDate(task.date)}`; meta.append(due); }
          content.append(meta);
          const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'delete'; remove.textContent = '×'; remove.setAttribute('aria-label', `Excluir: ${task.title}`); remove.title = 'Excluir tarefa'; remove.addEventListener('click', () => { tasks = tasks.filter(item => item.id !== task.id); save(); render(); });
          article.append(checkbox, content, remove); list.append(article);
        }
        const open = tasks.filter(task => !task.done).length;
        count.textContent = `${tasks.length} ${tasks.length === 1 ? 'tarefa' : 'tarefas'}`;
        remaining.textContent = `${open} ${open === 1 ? 'em aberto' : 'em aberto'}`;
      }
      function updateTask(id, changes) { tasks = tasks.map(task => task.id === id ? { ...task, ...changes } : task); save(); render(); }
      form.addEventListener('submit', event => {
        event.preventDefault();
        const title = titleInput.value.trim();
        if (!title) { error.textContent = 'Escreva uma descrição para a tarefa.'; titleInput.focus(); return; }
        error.textContent = '';
        tasks.unshift({ id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`, title, priority: document.querySelector('#task-priority').value, date: dateInput.value, done: false });
        save(); render(); form.reset(); document.querySelector('#task-priority').value = 'medium'; titleInput.focus();
      });
      titleInput.addEventListener('input', () => { if (titleInput.value.trim()) error.textContent = ''; });
      document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
        filter = button.dataset.filter;
        document.querySelectorAll('.filter').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
        render();
      }));
      document.querySelector('#today-label').textContent = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
      render();
    })();