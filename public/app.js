let currentPostId = null;

function show(id) {
  ['view-list', 'view-write', 'view-detail'].forEach(v => {
    document.getElementById(v).style.display = v === id ? '' : 'none';
  });
}

async function showList() {
  show('view-list');
  const res = await fetch('/api/posts');
  const posts = await res.json();
  const tbody = document.getElementById('post-list');
  const empty = document.getElementById('empty-msg');

  tbody.innerHTML = '';
  if (posts.length === 0) {
    document.getElementById('post-table').style.display = 'none';
    empty.style.display = '';
    return;
  }

  document.getElementById('post-table').style.display = '';
  empty.style.display = 'none';

  posts.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.id}</td>
      <td class="title-cell" onclick="showDetail(${p.id})">${escapeHtml(p.title)}</td>
      <td>${escapeHtml(p.author)}</td>
      <td>${p.created_at.slice(0, 16)}</td>
    `;
    tbody.appendChild(tr);
  });
}

function showWrite() {
  document.getElementById('write-form').reset();
  show('view-write');
}

async function showDetail(id) {
  const res = await fetch(`/api/posts/${id}`);
  if (!res.ok) { alert('글을 불러오지 못했습니다.'); return; }
  const post = await res.json();
  currentPostId = id;

  document.getElementById('detail-title').textContent = post.title;
  document.getElementById('detail-author').textContent = '작성자: ' + post.author;
  document.getElementById('detail-date').textContent = post.created_at.slice(0, 16);
  document.getElementById('detail-content').textContent = post.content;
  show('view-detail');
}

async function deletePost() {
  if (!confirm('정말 삭제하시겠습니까?')) return;
  const res = await fetch(`/api/posts/${currentPostId}`, { method: 'DELETE' });
  if (res.ok) {
    showList();
  } else {
    alert('삭제에 실패했습니다.');
  }
}

document.getElementById('write-form').addEventListener('submit', async e => {
  e.preventDefault();
  const body = {
    title:   document.getElementById('input-title').value,
    content: document.getElementById('input-content').value,
    author:  document.getElementById('input-author').value,
  };
  const res = await fetch('/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (res.ok) {
    showList();
  } else {
    const err = await res.json();
    alert(err.error);
  }
});

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// 초기 로드
showList();
