const inputArea = document.getElementById('inputArea');
const addTodo = document.getElementById('addTodo');
const inputBox = document.getElementById('inputBox');
const entered = document.getElementById('entered');
const selectP = document.getElementById('selectP');
const selectC = document.getElementById('selectC');
const inputDue = document.getElementById('inputDue');
const inputTag = document.getElementById('inputTag');
const empty = document.getElementById('empty');

const todos = JSON.parse(localStorage.getItem('todos'));
const categories = JSON.parse(localStorage.getItem('categories'));

// 現在のフィルター状態を記憶しておく
let currentFilter = { type: null, selected: null };

//現在のフィルター状態を再適用する
function reApplyFilter() {
    if (currentFilter.type === 'priority') filterPriority(currentFilter.selected);
    if (currentFilter.type === 'due') filterDue(currentFilter.selected);
    if (currentFilter.type === 'category') filterCategory(currentFilter.selected);
}

// ｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰソート機能ｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰ
// ｰｰｰｰｰｰｰｰｰｰｰｰｰフリーワード検索ｰｰｰｰｰｰｰｰｰｰｰｰｰ
const searchBox = document.getElementById('searchBox');
const searchButton = document.getElementById('searchButton');

function filterSearch() {
    const searchWord = searchBox.value;
    const lists = document.querySelectorAll('#entered li');
    let visibleCount = 0;

    lists.forEach(function (li) {
        const todoText = li.querySelector('.addText').innerText;
        if (todoText.includes(searchWord)) {
            li.style.display = '';
            visibleCount++;
        } else {
            li.style.display = 'none';
        }
    });

    empty.style.display = visibleCount === 0 ? 'block' : 'none';
}

searchButton.addEventListener('click', filterSearch);
searchBox.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') filterSearch();
});

// 入力中の文字を削除
document.getElementById('searchClear').addEventListener('click', function () {
    searchBox.value = '';
    filterSearch();
});


// ｰｰｰｰｰｰｰｰｰｰｰｰｰ優先度フィルターｰｰｰｰｰｰｰｰｰｰｰｰｰ
document.querySelectorAll('.priority .element').forEach(function (li) {
    li.addEventListener('click', function () {
        const selected = li.innerText; // クリックされた項目を取得
        filterPriority(selected);
    });
});

function filterPriority(selected) {
    currentFilter = { type: 'priority', selected: selected };
    const lists = document.querySelectorAll('#entered li');
    let visibleCount = 0;

    lists.forEach(function (li) {
        const priority = li.querySelector('.addPriority').innerText.replace('優先度：', '');

        // すべての場合は全表示、それ以外はフィルターの文言と比較して一致したもの以外を非表示
        if (selected === 'すべて' || priority === selected) {
            li.style.display = '';
            visibleCount++;
        } else {
            li.style.display = 'none';
        }
    });

    empty.style.display = visibleCount === 0 ? 'block' : 'none';
}


//ーｰｰｰｰｰｰｰｰｰｰｰｰｰリミットフィルターーｰｰｰｰｰｰｰｰｰｰｰｰｰ
document.querySelectorAll('.limit .element').forEach(function (li) {
    li.addEventListener('click', function () {
        const selected = li.innerText;
        filterDue(selected);
    });
});

document.querySelectorAll('.calendar').forEach(function (cal) {
    cal.addEventListener('change', function () {
        filterDue('日付指定');
    });
});

function filterDue(selected) {
    currentFilter = { type: 'due', selected: selected };
    const today = new Date().toISOString().split('T')[0];
    const lists = document.querySelectorAll('#entered li');
    let visibleCount = 0;

    lists.forEach(function (li) {
        const due = li.querySelector('.addDue').innerText.replace('期限：', '');
        let show = false;

        if (selected === 'すべて') {
            show = true;
        } else if (selected === '今日' && due === today) {
            show = true;
        } else if (selected === '日付指定') {
            const startDate = document.querySelector('.calendar:first-child').value;
            const endDate = document.querySelector('.calendar:last-child').value;

            if (due >= startDate && due <= endDate) {
                show = true;
            }

        } else if (selected === '期限切れ' && due < today && due !== 'なし') {
            show = true;
        } else if (selected === '期限なし' && due === 'なし') {
            show = true;
        } else if (selected === '完了' && li.classList.contains('done')) {
            show = true;
        }

        li.style.display = show ? '' : 'none';
        if (show) visibleCount++;
    });
    empty.style.display = visibleCount === 0 ? 'block' : 'none';
}

//カレンダーのクリック可能範囲拡大
document.querySelectorAll('input[type="date"]').forEach(function (input) {
    input.addEventListener('click', function () {
        input.showPicker();
    });
});

// 「日付指定」以外のリミットをクリックするとカレンダーをリセット
document.querySelectorAll('.limit li').forEach(function (li) {
    li.addEventListener('click', function () {
        if (!li.querySelector('.inputLimit')) {
            document.querySelectorAll('.calendar').forEach(function (cal) {
                cal.value = '';
            });
        }
    });
});


//ーｰｰｰｰｰｰｰｰｰｰｰｰｰカテゴリフィルターーｰｰｰｰｰｰｰｰｰｰｰｰｰ
document.querySelectorAll('.category .element').forEach(function (li) {
    li.addEventListener('click', function () {
        const selected = li.innerText; // クリックされた項目を取得
        filterCategory(selected);
    });
});

function filterCategory(selected) {
    currentFilter = { type: 'category', selected: selected };
    const lists = document.querySelectorAll('#entered li');
    let visibleCount = 0;

    lists.forEach(function (li) {
        const category = li.querySelector('.addCategory').innerText.replace('カテゴリ：', '');

        // すべての場合は全表示、それ以外はフィルターの文言と比較して一致したもの以外を非表示
        if (selected === 'すべて' || category === selected) {
            li.style.display = '';
            visibleCount++;
        } else {
            li.style.display = 'none';
        }
    });

    empty.style.display = visibleCount === 0 ? 'block' : 'none';
}


// ｰｰｰｰｰｰｰｰｰｰｰｰｰカテゴリの編集ｰｰｰｰｰｰｰｰｰｰｰｰｰ
// カテゴリを編集するための関数
function saveCategories() {
    const categoryItems = document.querySelectorAll('.category .element');
    let categories = [];
    categoryItems.forEach(function (item) {
        categories.push(item.innerText);
    });

    localStorage.setItem('categories', JSON.stringify(categories));
}

// カテゴリを入力or削除するための関数
function addCategoryEvent(li) {
    // 左クリックでフィルター
    li.addEventListener('click', function () {
        const selected = li.innerText;
        filterCategory(selected);
    });
    // 右クリックで削除
    li.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        if (li.innerText === 'すべて') return;
        const result = confirm('このカテゴリを削除しますか？');
        if (result) {
            li.remove();
            saveCategories();
            updateSelectC();
        }
    });
}

//入力フォームでカテゴリフィルターから現在保存しているカテゴリを取得する関数
function updateSelectC() {
    selectC.innerHTML = '';

    // デフォルトの選択肢
    const defaultOption = document.createElement('option');
    defaultOption.value = 'notSelected';
    defaultOption.innerText = '--カテゴリなし--';
    selectC.appendChild(defaultOption);

    // 「.category .element」からカテゴリを取得して追加
    document.querySelectorAll('.category .element').forEach(function (el) {
        if (el.innerText === 'すべて') return;
        const option = document.createElement('option');
        option.innerText = el.innerText;
        selectC.appendChild(option);
    });
}

// ローカルストレージのcategoriesが空でなければデータを呼び出す
if (categories) {
    document.querySelectorAll('.category .element').forEach(function (el) {
        el.remove();
    });

    categories.forEach(function (category) {
        const cateLi = document.createElement('li');
        cateLi.innerText = category;
        cateLi.classList.add('element');
        addCategoryEvent(cateLi);
        document.querySelector('.category').appendChild(cateLi);
    });
    updateSelectC();
} else {
    // データがなければHTMLの直書きをそのまま表示
    // デフォルトのカテゴリをストレージ保存
    saveCategories();
    document.querySelectorAll('.category .element').forEach(function (cateLi) {
        addCategoryEvent(cateLi)
    });
}

// カテゴリの追加
document.getElementById('defineCategory').addEventListener('click', function () {
    const newCategory = prompt('カテゴリを入力');
    if (newCategory) {
        const cateLi = document.createElement('li');
        cateLi.innerText = newCategory;
        cateLi.classList.add('element');
        addCategoryEvent(cateLi);
        document.querySelector('.category').appendChild(cateLi);
        saveCategories();
        updateSelectC();
    }
});


// ｰｰｰｰｰｰｰｰｰｰｰｰｰtodoリストの登録ｰｰｰｰｰｰｰｰｰｰｰｰｰ
// ローカルストレージのtodosが空でなければif文の内容を実行
if (todos) {
    todos.forEach(function (todo) {
        console.log(todo.completed)
        add(todo);
    })
}

// 入力が確定されたらeventの関数を呼び出す
function todoSubmit(event) {
    event.preventDefault();    // リロード防止
    console.log(inputBox.value);
    add();
};

inputArea.addEventListener('submit', todoSubmit);
addTodo.addEventListener('click', todoSubmit);


// ｰｰｰｰｰｰｰｰｰｰｰｰｰ作成したliタグに項目を追加するｰｰｰｰｰｰｰｰｰｰｰｰｰ
function add(todo) {
    let todoText = inputBox.value;

    // todosが空でなければローカルストレージからJSONを読み込んで保存されているデータが呼び出されているはずなので、 「if (todoText.length > 0) {～」の対象に含まれるようにする
    if (todo) {
        todoText = todo.text;
    }

    // liタグを作成してinputBox.valueの内容を入力し、作成したliタグにクラスを追加する
    if (todoText) {
        empty.style.display = 'none';

        const li = document.createElement('li');
        li.classList.add('contents');

        // チェックボックスとtodoテキストを表示する用のdivを追加
        const task = document.createElement('div');
        task.classList.add('task');

        // 完了したらチェックマークを表示するためのチェックボックスを作成
        const doneCheck = document.createElement('input');
        doneCheck.type = "checkbox";
        doneCheck.classList.add('doneCheck');
        task.appendChild(doneCheck);

        // タスク名
        const addText = document.createElement('p');
        addText.innerText = todoText;
        addText.classList.add('addText');
        task.appendChild(addText);

        // keywordのdivを作成
        const keyword = document.createElement('div');
        keyword.classList.add('keyword');

        // 優先度
        const addPriority = document.createElement('p');
        addPriority.innerText = todo ? todo.priority : '優先度：' + selectP.options[selectP.selectedIndex].text;
        addPriority.classList.add('addPriority', 'details');
        keyword.appendChild(addPriority);

        // 期限
        const addDue = document.createElement('p');
        addDue.innerText = todo ? todo.due : (inputDue.value ? '期限：' + inputDue.value : '期限：なし');
        addDue.classList.add('addDue', 'details');
        keyword.appendChild(addDue);

        // カテゴリ
        const addCategory = document.createElement('p');
        addCategory.innerText = todo ? todo.category : 'カテゴリ：' + selectC.options[selectC.selectedIndex].text;
        addCategory.classList.add('addCategory', 'details');
        keyword.appendChild(addCategory);

        // タグ
        const addTag = document.createElement('p');
        addTag.innerText = todo ? todo.tag : 'タグ：' + inputTag.value;
        addTag.classList.add('addTag', 'details');
        keyword.appendChild(addTag);

        // 編集／削除用のdivを作成
        const editArea = document.createElement('div');
        editArea.classList.add('editArea');

        // 削除ボタン
        const todoDelete = document.createElement('button');
        todoDelete.classList.add('todoDelete', 'button');
        todoDelete.innerText = '削除';
        editArea.appendChild(todoDelete);

        li.appendChild(task);
        li.appendChild(keyword);
        keyword.appendChild(editArea);


        // ｰｰｰｰｰｰｰｰｰｰｰｰｰ完了に関わる処理ｰｰｰｰｰｰｰｰｰｰｰｰｰ
        // classに"done"があればチェックが入っている状態にする
        doneCheck.addEventListener('click', function (checkEvent) {
            checkEvent.stopPropagation();
            // チェックボックスの状態に合わせてdoneを切り替える
            li.classList.toggle('done');
            doneCheck.checked = li.classList.contains('done');
            saveData();
            reApplyFilter();
        });

        // 追加したliタグを削除する
        todoDelete.addEventListener('click', function (deleteEvent) {
            deleteEvent.stopPropagation();
            const result = confirm('このタスクをトド岩に送りますか？');
            if (result) {
                li.remove();
                saveData();
                reApplyFilter();
                // タスクを完全に消去した場合にタスクが無いことを表示する
                if (currentFilter.type === null) {
                    empty.style.display = entered.querySelectorAll('li').length === 0 ? 'block' : 'none';
                }
            }
        });

        // 左クリックすると完了を意味する取り消し線を追加
        li.addEventListener('click', function (doneEvent) {
            li.classList.toggle('done');
            doneEvent.stopPropagation();
            doneCheck.checked = li.classList.contains('done');
            saveData();
            reApplyFilter();
        });


        // 作成したliタグの挿入
        entered.appendChild(li);
        inputBox.value = '';   // 確定したら入力フォームを空に
        saveData();
    }
}

// セーブする内容
function saveData() {
    const lists = entered.querySelectorAll('li');
    let todos = [];
    lists.forEach(function (list) {
        let todo = {
            text: list.querySelector('.addText').innerText,
            priority: list.querySelector('.addPriority').innerText,
            category: list.querySelector('.addCategory').innerText,
            due: list.querySelector('.addDue').innerText,
            tag: list.querySelector('.addTag').innerText,
            completed: list.classList.contains('done')
        };
        console.log(JSON.parse(localStorage.getItem('todos')));


        todos.push(todo);    // innerTextを保存
    });


    // 更新のたびにデータが消えないように、JSON形式でブラウザのローカルストレージ機能に保存する
    localStorage.setItem('todos', JSON.stringify(todos));
    console.log(lists);
}


// ハンバーガーメニュー
const overlay = document.getElementById('overlay');

document.getElementById('hamburger').addEventListener('click', function () {
    document.querySelector('.sortArea').classList.toggle('isOpen');
    overlay.classList.toggle('isOpen');
    this.classList.toggle('isOpen');
});

// オーバーレイクリックでも閉じる
overlay.addEventListener('click', function () {
    document.querySelector('.sortArea').classList.remove('isOpen');
    overlay.classList.remove('isOpen');
    document.getElementById('hamburger').classList.remove('isOpen');
});