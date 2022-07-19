// import loadHome from './pages/home';

// TODO
// Undo completed tasks (Complete button currently just copies itself)
// Preference to send completed tasks to beginning or end or list
// Form validation
// View all tasks (sort by urgency) (no project)
// drag n drop
// buttons dont work on completed projects
// close all modals when one is clicked to open
// Footer can have switches (mode, sorting, etc)
// Close buttons on project modal
// Add 'number of days until due'
// Organize all tasks by date, include project in this case
// Remove task button does not work on completed tasks
// Make item cards sleeker
// Stats sidebar
// Add task button not currently working on addproject button
// Edit task
// double-click project name to rename
// Items being sent to wrong project sometimes, need to tweak _lastOpenedProject updates
// Complete items sort every refresh lol

// IDEAS
// Arrows pointing to certain tasks from the right - Alert! This task is due in 2 days! etc
// Be able to tag projects by color
// Communicate priority by border around OR just color the circle differently
// Color blind mode

import {isAfter, format, getDay, parseISO} from 'date-fns';
import { fi } from 'date-fns/locale';

class Item {
    constructor(title, dueDate, priority, project) {
        this.title = title;
        this.dueDate = dueDate;
        this.priority = priority;
        this.project = project;
        this.isComplete = false;
    }
}

class Project {
    constructor(title) {
        this.title = title;
        this.items = [];
        this.completedItems = [];
        this.isComplete = false;
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
let _lastOpenedProject;

function createItem(title, dueDate, priority, project) {
    return new Item(title, dueDate, priority, project)
}

function createItemCard(item) {
    const itemCard = document.createElement('div');
    const itemContentContainer = document.createElement('div');
    const left = document.createElement('div');
    const itemCompleteBtn = document.createElement('div');
    const itemTitle = document.createElement('h4');
    const itemDueDate = document.createElement('p')
    const itemPriority = document.createElement('p')
    const right = document.createElement('div');
    const removeItemBtn = document.createElement('div');

    itemCard.classList.add('item-card')
    if(item.priority === 'Critical'){
        itemCard.classList.add('item-critical')
    }
    left.classList.add('item-card-left') 
    itemContentContainer.classList.add('item-card-content');
    itemTitle.classList.add('item-title');
    itemDueDate.classList.add('item-due-date');
    itemPriority.classList.add('item-priority');
    right.classList.add('item-card-right')
    itemCompleteBtn.classList.add('item-card-btn');
    itemCompleteBtn.classList.add('item-complete-btn');
    removeItemBtn.classList.add('item-remove-btn');
    removeItemBtn.classList.add('item-card-btn');

    itemCompleteBtn.addEventListener('click', () => {
        completeItem(item)
        itemCard.classList.add('item-card-complete')
    })
    if(item.priority === 'Low'){
        itemCompleteBtn.classList.add('item-complete-btn-low')
    }
    if(item.priority === 'Medium'){
        itemCompleteBtn.classList.add('item-complete-btn-medium')
    }
    if(item.priority === 'High'){
        itemCompleteBtn.classList.add('item-complete-btn-high')
    }
    if(item.priority === 'Critical'){
        itemCompleteBtn.classList.add('item-complete-btn-critical')
    }

    removeItemBtn.addEventListener('click', () => {
        removeItem(item);
    });

    itemTitle.textContent = item.title;
    itemDueDate.textContent = `Due: ${item.dueDate}`;
    // itemPriority.textContent = `Priority: ${item.priority}`;
    

    if(item.isComplete){
        itemCard.classList.add('item-card-complete')
    }
    
    left.appendChild(itemCompleteBtn);
    left.appendChild(itemContentContainer);
    // right.appendChild(removeItemBtn);
    right.appendChild(itemDueDate);
    itemContentContainer.appendChild(itemTitle);
    // itemContentContainer.appendChild(itemDueDate);
    // itemContentContainer.appendChild(itemPriority);
    itemCard.appendChild(left);
    itemCard.appendChild(right);

    return itemCard;
}

function createProject(title) {
    let project = new Project(title);
    
    return project;
}

function createProjectCard(project) {
    const projectCard = document.createElement('div');
    const projectCardHeader = document.createElement('div');
    const addItemBtn = document.createElement('div');
    const btnContainer = document.createElement('div');
    const itemCardContainer = document.createElement('div');
    const itemModal = createAddItemModal2();
    // if(!project){
    //     project = createProject('Default');
    // }
    console.log(`Project is ${project}`)
    projectCard.id = `project-${project.title}`;
    projectCard.classList.add('project-card');
    if(project.isComplete){
        projectCard.classList.add('project-card-complete')
    }

    projectCardHeader.classList.add('project-card-header')
    btnContainer.classList.add('project-card-btn-container');
    itemCardContainer.classList.add('project-item-card-container');

    addItemBtn.classList.add('project-card-add-item-btn');
    addItemBtn.classList.add('add-item-btn-active');
    addItemBtn.textContent = '+';
    addItemBtn.addEventListener('click', () => {
        const addItemModal = document.getElementById('add-item-modal');
        addItemModal.classList.toggle('modal-active');
        if(addItemModal.style.display === 'block'){
            addItemModal.style.display = 'none';
        } else {
            addItemModal.style.display = 'block';
        }
        addItemBtn.classList.toggle('add-item-btn-active');
        if(addItemBtn.style.display === 'none'){
            addItemBtn.style.display = 'block';
        } else {
            addItemBtn.style.display = 'none';
        }
    })
    // addItemBtn.addEventListener('click', openAddItemModal);
    const projectCardTitle = document.createElement('h1');
    projectCardTitle.classList.add('project-card-title');
    projectCardTitle.textContent = `${project.title}`;

    // const completeBtn = document.createElement('button');
    // completeBtn.classList.add('complete-project-button');
    // completeBtn.innerText = 'O';
    // completeBtn.addEventListener('click', () => {
    //     completeProject(project);
    // })

    // const delBtn = document.createElement('button');
    // delBtn.classList.add('delete-project-btn');
    // delBtn.innerText = 'X';
    // delBtn.addEventListener('click', (e) => {
    //     // could be its own removeProject function
    //     removeProject(project);
    //     updatePage();
    // })
   
    projectCardHeader.appendChild(projectCardTitle);
    // btnContainer.appendChild(completeBtn);
    // btnContainer.appendChild(delBtn);
    projectCardHeader.appendChild(btnContainer);
    projectCard.appendChild(projectCardHeader);
    projectCard.appendChild(addItemBtn);
    projectCard.appendChild(itemModal);


    for(let item of project.items){
        itemCardContainer.appendChild(createItemCard(item));
    }
    for(let item of project.completedItems){
        itemCardContainer.appendChild(createItemCard(item));
    }
    projectCard.appendChild(itemCardContainer);
    


    return projectCard;
}

function completeProject(projectToComplete) {
    if(projectToComplete.isComplete){
        return console.log('Project is already complete')
    } else {
        projectToComplete.isComplete = true;
        for(let item of projectToComplete.items){
            completeItem(item);
        }
        updatePage();
    }
}

function completeItem(itemToComplete) {
    itemToComplete.isComplete = true;
    const project = getProject(itemToComplete.project);
    const indexOfItem = project.items.findIndex((item) => item.title === itemToComplete.title);
    const firstIndex = findFirstCompletedItem(project);
    if(firstIndex && firstIndex !== 0){
        project.items.splice(firstIndex, 0, itemToComplete)
    } else {
        project.items.push(project.items.splice(indexOfItem,1)[0])
    }    
    updatePage();
}

function findFirstCompletedItem(project) {
    const firstCompleted = project.items.find((item) => item.isComplete);
    if(!firstCompleted){
        return null;
    }
    const indexOfItem = project.items.findIndex((item) => item.title === firstCompleted.title);
    console.log(indexOfItem);
    return indexOfItem;
}

function createAppNav() {
    const addItemModal = document.getElementById('add-item-modal');
    const addProjectModal = document.getElementById('add-project-modal');

    const projectCardNav = document.createElement('nav');

    const addProjectBtn = document.createElement('button');
    const addItemBtn = document.createElement('button');

    addProjectBtn.classList.add('add-project-btn');
    addProjectBtn.innerHTML = 'Add project';
    addProjectBtn.addEventListener('click', () => {
        addProjectModal.classList.toggle('modal-active');
        if(addProjectModal.style.display === 'block') {
            addProjectModal.style.display = 'none';
        } else {
            addProjectModal.style.display = 'block';
        }
    })

    addItemBtn.classList.add('add-item-btn');
    addItemBtn.innerHTML = 'Add task';
    addItemBtn.addEventListener('click', () => {
        addItemModal.classList.toggle('modal-active');
        if(addItemModal.style.display === 'block') {
            addItemModal.style.display = 'none';
        } else {
            addItemModal.style.display = 'block';
        }
    })

    const clearLocalStorageBtn = document.createElement('button');
    clearLocalStorageBtn.classList.add('clear-local-storage-btn');
    clearLocalStorageBtn.innerHTML = 'Clear localStorage'
    clearLocalStorageBtn.addEventListener('click', () => {
        localStorage.clear();
        console.log('localStorage cleared')
    })
    
    projectCardNav.appendChild(addProjectBtn);
    // projectCardNav.appendChild(addItemBtn);
    // projectCardNav.appendChild(editProjectTitleBtn);
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
        if(!project.isComplete){
            const option = document.createElement('option');
            option.value = project.title;
            option.innerText = project.title;
            dropdown.appendChild(option);
        }
    })
}

function createAddProjectModal() {
    const addProjectModal = document.createElement('div');
    addProjectModal.classList.add('modal');
    addProjectModal.id = 'add-project-modal';

    const addProjectForm = document.createElement('form');
    addProjectForm.id = 'add-project-form';

    const projectTitleLabel = document.createElement('label');
    projectTitleLabel.id = 'new-project-title'
    projectTitleLabel.innerText = 'Title:'

    const projectTitleInput = document.createElement('input');
    projectTitleInput.type = 'text';
    projectTitleInput.id = 'project-title-input';
    projectTitleInput.name = 'new-project-title';

    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.innerText = 'Submit';

    addProjectForm.appendChild(projectTitleLabel)
    addProjectForm.appendChild(projectTitleInput)
    addProjectForm.appendChild(submitBtn);
    addProjectForm.onsubmit = addProject;

    addProjectModal.appendChild(addProjectForm);

    return addProjectModal;
}

function createAddItemModal2() {
    const addItemModal = document.createElement('div');
    addItemModal.classList.add('modal');
    addItemModal.id       = 'add-item-modal';

    const addItemForm = document.createElement('form');
    addItemForm.id = 'add-item-form';

    const formTop = document.createElement('div');
    formTop.id = 'add-item-form-top';
    const formBottom = document.createElement('div');
    formBottom.id = 'add-item-form-bottom';



    // const project = e.target.parentNode.id;
   
    const itemTitleInput     = document.createElement('input');
    itemTitleInput.type      = 'text';
    itemTitleInput.id        = 'new-item-title';
    itemTitleInput.name      = 'itemTitle';
    itemTitleInput.placeholder = `To do`

    const itemDueDateInput     = document.createElement('input');
    itemDueDateInput.type      = 'date';
    itemDueDateInput.id        = 'new-item-duedate';
    itemDueDateInput.name      = 'itemDueDate';

    const dropdownPriority = document.createElement('select');
    dropdownPriority.id = 'selectPriority';
    const lowPriority = document.createElement('option');
    lowPriority.value = 'Low';
    lowPriority.innerText = 'Low';
    const mediumPriority = document.createElement('option');
    mediumPriority.value = 'Medium';
    mediumPriority.innerText = 'Medium';
    const highPriority = document.createElement('option');
    highPriority.value = 'High';
    highPriority.innerText = 'High';
    const critPriority = document.createElement('option');
    critPriority.value = 'Critical';
    critPriority.innerText = 'Critical';

    dropdownPriority.appendChild(lowPriority)
    dropdownPriority.appendChild(mediumPriority)
    dropdownPriority.appendChild(highPriority)
    dropdownPriority.appendChild(critPriority)
    
    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.id = 'item-modal-submit-btn'
    submitBtn.innerText = 'Submit'
    submitBtn.addEventListener('click', console.log(submitBtn.parentNode))

    const project = document.createElement('input');
    project.type = 'text';
    project.id = 'selectProject';
    project.classList.add('no-display');
    project.value = _lastOpenedProject;

    addItemForm.appendChild(project);
    formTop.appendChild(itemTitleInput);
    formBottom.appendChild(itemDueDateInput);
    formBottom.appendChild(dropdownPriority);
    formBottom.appendChild(submitBtn);
    addItemForm.appendChild(formTop);   
    addItemForm.appendChild(formBottom);

    addItemForm.onsubmit = addItem;
    addItemModal.appendChild(addItemForm);
    
    return addItemModal;
}

// process item form 2

function closeAllModals() {
    const addItemModal = document.getElementById('add-item-modal');
    const addProjectModal = document.getElementById('add-project-modal');
    addItemModal.classList.remove('modal-active');
    addProjectModal.classList.remove('modal-active')

}

function resetForms() {
    const addItemForm = document.getElementById('add-item-form');
    const addProjectForm = document.getElementById('add-project-form');

    addItemForm.reset();
    addProjectForm.reset();
}

function processProjectFormData() {
    const title = document.getElementById('project-title-input').value;
    return createProject(title)
}

function processItemFormData() {
    const title    = document.getElementById('new-item-title').value
    let dueDate  = document.getElementById('new-item-duedate').value
    if(dueDate){
        dueDate = format(parseISO(dueDate), ("eee, " + "MMMM " + "dd"));
    }
    const priority = document.getElementById('selectPriority').value
    const project  = document.getElementById('selectProject').value

    return createItem(title, dueDate, priority, project)
}

function addProject(e) {
    console.log('Adding project')
    e.preventDefault();
    const newProject = processProjectFormData();
    console.log('Successfully processed project form data')
    _projects.push(newProject);
    _lastOpenedProject = newProject.title;
    updatePage();

}

function addItem(e) {
    e.preventDefault();
    const newItem = processItemFormData();
    console.log('Succsesfully processed item form data')
    const project = getProject(newItem.project);
    let indexOfProject = _projects.findIndex((project) => project.title == newItem.project);
    if(newItem.priority === 'Critical'){
        _projects[indexOfProject].items.unshift(newItem)
        resetForms();
        updatePage();
        return;
    }  
    
    const firstIndex = findFirstCompletedItem(_projects[indexOfProject]);
    console.log(`First completed index is ${firstIndex}`)
    if(firstIndex !== null){
        if(firstIndex == 0 || firstIndex == -1) {
            console.log('UNSHIFITNG')
            _projects[indexOfProject].items.unshift(newItem)
        } else {
            console.log('SPLICING')
            _projects[indexOfProject].items.splice(firstIndex, 0, newItem);
        }
    } else {
        console.log('PUSHING')
        _projects[indexOfProject].items.push(newItem);
    }
    
    resetForms();
    updatePage();

    // closeAddItemModal();
}

function removeProject(projectToRemove) {
    _projects = _projects.filter(proj => proj.title !== projectToRemove.title)   
}

function removeItem(itemToRemove) {
    const project = getProject(itemToRemove.project);
    if(itemToRemove.isComplete){
        console.log('Removing completed task')
        project.completedItems = project.completedItems.filter((item) => item.title !== itemToRemove.title);
    } else {
        project.items = project.items.filter((item) => item.title !== itemToRemove.title);
    }
}

function getProject(title) {
    return _projects.find((project) => project.title === title);
}

function sortProjects() {
    for(let i = 0; i < _projects.length; i++){
        if(_projects[i].isComplete){
            _projects.push(_projects.splice(i, 1)[0])
        }
    }
}

function renderProjectCards() {
    const main = document.getElementById('main');
    main.innerHTML = '';
    // let projects = _projects;
    // let completedProjects = _completedProjects;
    if(_projects === null){
        _projects = [];
    }

    if(_projects.length == 0){
        const placeholder = document.createElement('div');
        placeholder.classList.add('projects-placeholder')
        const placeholderText = document.createElement('p');
        placeholderText.classList.add('projects-placeholder-text')
        placeholderText.innerHTML = `<p>Your projects will go here!</p>
                                     <p>Click <b>"Add project"</b> to get started.</p>'`
        placeholder.appendChild(placeholderText);
        main.appendChild(placeholder);
    }

    for(let project of _projects){
        let projectCard = createProjectCard(project);        
        main.appendChild(projectCard);
    }
 

    
    console.log('Project cards rendered')
}

function renderProject(project) {
    resetPage();
    // if(project === undefined){
    //     project = createProject('Default');
    // }
    if(!project){
        project = createProject('Default');
        _projects.push(project);
    }
    _lastOpenedProject = project.title;

    const main = document.getElementById('main');
    main.appendChild(createProjectCard(project));
    saveLocal();
}

// base

function createAppContainer() {
    const content = document.createElement('div');
    content.classList.add('content');
    content.id = 'content';

    return content;
}

function createSidebar() {
    const sidebar = document.createElement('div');
    sidebar.classList.add('sidebar');
    sidebar.id = 'sidebar';

    return sidebar;
}

function createSidebarMenus() {
    const sidebar = document.getElementById('sidebar');
    sidebar.innerHTML = '';
    const menuContainer = document.createElement('div');
    menuContainer.id = 'sidebar-menus-container';

    const projectMenuTitle = document.createElement('p');
    projectMenuTitle.id = 'project-menu-title';
    projectMenuTitle.classList.add('menu-title');
    projectMenuTitle.classList.add('collapsible');
    projectMenuTitle.textContent = '📚Projects'
    projectMenuTitle.addEventListener('click', (e) => {
        e.target.classList.toggle('sidebar-menu-active');
        console.log(e.target);
        const projects = e.target.nextElementSibling;
        if(projects.style.display === 'block') {
            projects.style.display = 'none';
        } else {
            projects.style.display = 'block';
        }
    })


    menuContainer.appendChild(projectMenuTitle);

    const projectMenu = document.createElement('ul');
    projectMenu.id = 'sidebar-projects-dropdown';
   
    for(let project of _projects){
        const projOption = document.createElement('li');
        projOption.classList.add('sidebar-projects-dropdown-option');
        projOption.id = project.title;
        projOption.textContent = project.title;
        projOption.addEventListener('click', () => {
            renderProject(project);
            // Add class that makes option bold when selected
        })

        projectMenu.appendChild(projOption);
    }
    menuContainer.appendChild(projectMenu);

    const taskMenuTitle = document.createElement('p');
    taskMenuTitle.id = 'task-menu-title';
    taskMenuTitle.classList.add('menu-title');
    taskMenuTitle.classList.add('collapsible')
    taskMenuTitle.textContent = '☑️Tasks'
    taskMenuTitle.addEventListener('click', (e) => {
        e.target.classList.toggle('sidebar-menu-active');
        console.log(e.target);
        const tasks = e.target.nextElementSibling;
        if(tasks.style.display === 'block') {
            tasks.style.display = 'none';
        } else {
            tasks.style.display = 'block';
        }
    })

    menuContainer.appendChild(taskMenuTitle);
    const taskMenu = document.createElement('ul');
    taskMenu.id = 'sidebar-tasks-dropdown';

    const tasksAll = document.createElement('li');
    tasksAll.classList.add('sidebar-tasks-menu-card');
    tasksAll.id = 'sidebar-tasks-all';
    tasksAll.innerHTML = `All tasks`
    const tasksDay = document.createElement('li');
    tasksDay.classList.add('sidebar-tasks-menu-card');
    tasksDay.id = 'sidebar-tasks-within-day';
    tasksDay.innerHTML = `Due within the <b>day</b>`
    const tasksWeek = document.createElement('li');
    tasksWeek.classList.add('sidebar-tasks-menu-card');

    tasksWeek.id = 'sidebar-tasks-within-week';
    tasksWeek.innerHTML = `<p>Due within the <b>week</b>`
    const tasksMonth = document.createElement('li');
    tasksMonth.classList.add('sidebar-tasks-menu-card');

    tasksMonth.id = `sidebar-tasks-within-month`;
    tasksMonth.innerHTML = `<p>Due within the <b>month</b>`

    taskMenu.appendChild(tasksAll);
    taskMenu.appendChild(tasksDay);
    taskMenu.appendChild(tasksWeek);
    taskMenu.appendChild(tasksMonth);

    menuContainer.appendChild(taskMenu);
    sidebar.appendChild(menuContainer);
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
    main.addEventListener('click', closeAllModals);

    return main;
}

function createFooter() {
    const footer = document.createElement('footer');
    footer.classList.add('footer');
    footer.id = 'footer';

    return footer;
}

function initTodoApp() {

    const header = document.body.appendChild(createHeader());
    document.body.appendChild(createAddProjectModal());
    header.appendChild(createAppNav());

    const content = document.body.appendChild(createAppContainer());
    content.appendChild(createSidebar());

    content.appendChild(createMain());
    
    
    restoreLocal();
    createSidebarMenus();
    document.body.appendChild(createFooter());


}

const updateSidebarMenu = () => {
    const sidebarMenu = document.getElementById('sidebar-menus-container');
    if(sidebarMenu === null){
        console.log('null god');
        return createSidebarMenus;
    } else {
        console.log('Ill never take the null path')
        sidebarMenu.innerHTML = '';
        createSidebarMenus();
    }
}

const updatePage = () => {
    saveLocal();
    resetPage();
    renderProject(getProject(_lastOpenedProject))
    // updateDropdown();
    updateSidebarMenu();
    sortProjects();
    // sortItems();
    // renderProjectCards();
}

const saveLocal = () => {
    localStorage.setItem('savedProjects', JSON.stringify(_projects))
    localStorage.setItem('lastOpenedProject', _lastOpenedProject)
    console.log('saved local')
}

const restoreLocal = () => {
    const projects = JSON.parse(localStorage.getItem('savedProjects'))
    const lastOpenedProject = localStorage.getItem('lastOpenedProject');
    if(projects){
        _projects = projects;
    } else {
        _projects = [];
    }

    if(lastOpenedProject){
        _lastOpenedProject = lastOpenedProject;
    } else {
        _lastOpenedProject = undefined;
    }
    updatePage();
    
}

export default initTodoApp;