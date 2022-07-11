// import loadHome from './pages/home';

// TODO
// Determine why modal loads in with display:none and add btn must be clicked twicec
// revisit js_playground!
// Make priority a dropdown
// Make date a date input
// Allow spaces in project names
// Fix modal being active


class Item {
    constructor(title, description, dueDate, priority, project) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.project = project;
    }
}

class Project {
    constructor(title) {
        this.title = title;
        this.items = [];
    }

    addToItems(item) {
        this.items.push(item);
    }

    removeItem(item) {
        this.items.filter((listItem) => listItem.title !== item.title)
    }

    getItem(item) {
        return this.items.find((listItem) => listItem.title === item.title)
    }
}

let _projects = [];

function createItem(title, description, dueDate, priority, project) {
    return new Item(title, description, dueDate, priority, project)
}

function createItemCard(item) {
    let itemCard = document.createElement('div');
    itemCard.classList.add('item') 
    itemCard.classList.add(item.priority); 
    itemCard.innerHTML =    `
                            <h4 class='title'>${item.title}</h3>
                            <p class='description'>Desc: ${item.description}</p>
                            <p class='due-date'>Due: ${item.dueDate}</p>
                            <p class='priority'>Priority: ${item.priority}</p>
                            `
    return itemCard;
}

function createProject(title) {
    let project = new Project(title);
    let defaultItem = createItem('Default', 'This is a default task', 'Tomorrow', 'Soon', title)
    project.items.push(defaultItem)
    _projects.push(project);
    saveLocal();
    
    return project;
}

function createProjectCard(project) {
    const projectCard = document.createElement('div');
    projectCard.innerHTML = `<h1 class='project-card-title'>Project: ${project.title}</h1>`;
    project.id = project.title;
    projectCard.classList.add('project-card')
    projectCard.classList.add(project.title)

    for(let item of project.items){
        projectCard.appendChild(createItemCard(item));
    }
    
    return projectCard;
}

function createProjectCardNav() {
    const addItemModal = document.getElementById('add-item-modal');

    const projectCardNav = document.createElement('nav');

    const addProjectBtn = document.createElement('button');
    const addItemBtn = document.createElement('button');

    addProjectBtn.classList.add('add-project-btn');
    addProjectBtn.innerHTML = 'Add project';
    addProjectBtn.addEventListener('click', () => {
        
    })

    addItemBtn.classList.add('add-item-btn');
    addItemBtn.innerHTML = 'Add todo';
    addItemBtn.addEventListener('click', () => {
        if(addItemModal.classList.contains('active')) {
            return false;
        } else {        
            openAddItemModal();
        }
    })

    const editProjectTitleBtn = document.createElement('button');
    editProjectTitleBtn.classList.add('edit-project-title-btn');
    editProjectTitleBtn.innerHTML = 'Change project title'
    editProjectTitleBtn.addEventListener('click', () => {
    // load project title change modal
    // include double click option
    })

    const clearLocalStorageBtn = document.createElement('button');
    clearLocalStorageBtn.classList.add('clear-local-storage-btn');
    clearLocalStorageBtn.innerHTML = 'Clear localStorage'
    clearLocalStorageBtn.addEventListener('click', () => {
        localStorage.clear();
        console.log('localStorage cleared')
    })
    
    projectCardNav.appendChild(addItemBtn);
    projectCardNav.appendChild(editProjectTitleBtn);
    projectCardNav.appendChild(clearLocalStorageBtn)

    return projectCardNav;
}

function resetPage() {
    const main = document.getElementById('main');
    main.innerHTML = '';
}

function updateDropdown() {
    const dropdown = document.getElementById('selectProject');
    dropdown.innerHTML = '';
    _projects.map((project) => {
        const option = document.createElement('option');
        option.value = project.title;
        option.innerText = project.title;
        dropdown.appendChild(option);
    })
}

function createAddItemModal() {
    const addItemModal    = document.createElement('div');
    addItemModal.classList.add('add-item-modal');
    addItemModal.id       = 'add-item-modal';

    const addItemForm = document.createElement('form');
    addItemForm.id    = 'add-item-form';

    const dropdown = document.createElement('select');
    dropdown.id = 'selectProject';
    for(let i=0; i<_projects.length; i++) {
        let project = _projects[i];
        const option = document.createElement('option');
        option.value = project.title;
        option.innerText = project.title;
        dropdown.appendChild(option);
    }    

    const itemTitleLabel     = document.createElement('label');
    itemTitleLabel.id = 'itemTitle'
    itemTitleLabel.innerText = 'Title:'
    const itemTitleInput     = document.createElement('input');
    itemTitleInput.type      = 'text';
    itemTitleInput.id        = 'new-item-title';
    itemTitleInput.name      = 'itemTitle';
    
    const itemDescLabel     = document.createElement('label');
    itemDescLabel.id = 'itemDesc';
    itemDescLabel.innerText = 'Desc:'
    const itemDescInput     = document.createElement('input');
    itemDescInput.type      = 'text';
    itemDescInput.id        = 'new-item-desc';
    itemDescInput.name      = 'itemDesc';
    
    const itemDueDateLabel     = document.createElement('label');
    itemDueDateLabel.id = 'itemDueDate'
    itemDueDateLabel.innerText = 'DueDate:'
    const itemDueDateInput     = document.createElement('input');
    itemDueDateInput.type      = 'text';
    itemDueDateInput.id        = 'new-item-duedate';
    itemDueDateInput.name      = 'itemDueDate';
    
    const itemPriorityLabel     = document.createElement('label');
    itemPriorityLabel.id = 'itemPriority'
    itemPriorityLabel.innerText = 'Priority:'
    const itemPriorityInput     = document.createElement('input');
    itemPriorityInput.type      = 'text';
    itemPriorityInput.id        = 'new-item-priority';
    itemPriorityInput.name      = 'itemPriority';
    
    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.id = 'item-modal-submit-btn'
    submitBtn.innerText = 'Submit'


    addItemForm.appendChild(dropdown);
    addItemForm.appendChild(itemTitleLabel);
    addItemForm.appendChild(itemTitleInput);
    addItemForm.appendChild(itemDescLabel);
    addItemForm.appendChild(itemDescInput);
    addItemForm.appendChild(itemDueDateLabel);
    addItemForm.appendChild(itemDueDateInput);
    addItemForm.appendChild(itemPriorityLabel);
    addItemForm.appendChild(itemPriorityInput);
    addItemForm.appendChild(submitBtn);


    addItemForm.onsubmit = addItem;
    addItemModal.appendChild(addItemForm);
    
    return addItemModal;
}

function openAddItemModal() {
    const addItemModal = document.getElementById('add-item-modal');
    const addItemForm = document.getElementById('add-item-form');
    addItemForm.reset();
    addItemModal.classList.add('active');
}

function closeAddItemModal() {
    const addItemModal = document.getElementById('add-item-modal');
    const addItemForm = document.getElementById('add-item-form');
    addItemForm.reset();
    addItemModal.classList.remove('active');
}


function processFormData() {
    // need to pass along form results to project.addItem(etc);
    const title    = document.getElementById('new-item-title').value
    console.log(title)
    const desc     = document.getElementById('new-item-desc').value
    console.log(desc)
    const dueDate  = document.getElementById('new-item-duedate').value
    console.log(dueDate)
    const priority = document.getElementById('new-item-priority').value
    console.log(priority)
    const project  = document.getElementById('selectProject').value
    console.log(project)

    return createItem(title, desc, dueDate, priority, project)
}

function addItem(e) {
    e.preventDefault();
    const newItem = processFormData();
    console.log('Succsesfully processed form data')
    const project = getProject(newItem.project);
    let indexOfProject = _projects.findIndex((project) => project.title == newItem.project);
    _projects[indexOfProject].items.push(newItem);

    saveLocal();
    updatePage();

    closeAddItemModal();
}

function getProject(title) {
    return _projects.find((project) => project.title === title)
}

function renderProjectCards() {
    const main = document.getElementById('main');
    main.innerHTML = '';
    let projects = _projects;

 

    for(let i = 0; i < projects.length; i++) {
        let projectCard = createProjectCard(projects[i]);
        main.appendChild(projectCard);
    }
    updateDropdown();
    console.log('Project cards rendered')
}

// base

function createAppContainer() {
    const content = document.createElement('div');
    content.classList.add('content');
    content.id = 'content';

    return content;
}

function createHeader() {
    const header = document.createElement('header');
    header.classList.add('header');
    header.id = 'header';

    return header;
}

function createMain() {
    const main = document.createElement('main');
    main.classList.add('main');
    main.id = 'main';

    return main;
}

function createFooter() {
    const footer = document.createElement('footer');
    footer.classList.add('footer');
    footer.id = 'footer';

    return footer;
}

function initTodoApp() {
    const content = document.body.appendChild(createAppContainer());

    content.appendChild(createHeader());
    content.appendChild(createAddItemModal());

    content.appendChild(createMain());
    content.appendChild(createFooter());
    
    const header = document.getElementById('header')
    header.appendChild(createProjectCardNav());

    restoreLocal();
}

const updatePage = () => {
    resetPage();
    renderProjectCards();
}

const saveLocal = () => {
    localStorage.setItem('savedProjects', JSON.stringify(_projects))
    console.log('saved local')
}

const restoreLocal = () => {
    const projects = JSON.parse(localStorage.getItem('savedProjects'))

    if(projects === null) {
        console.log('null boy')
        _projects = [createProject('Default'), createProject('Default_2'), createProject('Default_3')]
        updatePage();
        return
    }
    if (projects.length > 0) {
        console.log('local restored!')
        _projects = projects;
        console.log('_projects: ' + _projects)
        updatePage(); 
    } else {
        console.log('no local found. initializing....')
        _projects = [createProject('Default'), createProject('Default_2'), createProject('Relaunch_Chamilitary')];
        updatePage();
    }
}

const JSONToProject = (project) => {
    return new Project(project.title)
}

export default initTodoApp;