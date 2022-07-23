// import loadHome from './pages/home';
import calendarIcon from "../icons/calendar.jpg";
import priorityIcon from "../icons/exclamation.png"

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
// Add task button not currently working on addproject button
// Edit task
// double-click project name to rename
// New project modal - maybe just in the header
// Seems like it may be worthwhile to track when it's in task mode
// Item modals + project modal all need fine tuning - close options, appearing in the right places, etc.
// When a task is completed in All tasks view, it should not render the project
// Be able to click out of rename title form to submit it
// Absolute positioning isn't working with px values as it depends on monitor
// Number of todos in sidebar (Birdbot v.20 (28))

// IDEAS
// Home (Tasks due today, stats snapshot, projects summary) / This Week / Projects / Stats
// Arrows pointing to certain tasks from the right - Alert! This task is due in 2 days! etc
// Be able to tag projects by color
// Communicate priority by border around OR just color the circle differently
// Color blind mode
// Be able to pin an item
// Collapible todo categories
// Stats sidebar
// Sorting
// If another card is needed at some point, could be square sides


import {isAfter, format, getDay, parseISO, add} from 'date-fns';
import { fi } from 'date-fns/locale';

class Item {
    constructor(title, dueDate, priority, project) {
        this.title = title;
        this.dueDate = dueDate;
        this.priority = priority;
        this.project = project;
        this.isComplete = false;
        this.completedDate;
    }
}

class Project {
    constructor(title) {
        this.title = title;
        this.items = [];
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

    rename(newTitle){
        return this.title = newTitle;
    }
}

let _projects = [];
let _lastOpenedProject;
// _currView will either be 'Project' or 'Tasks' or 'Stats' or 'Home'
let _currView = 'project';

function createItem(title, dueDate, priority, project) {
    return new Item(title, dueDate, priority, project)
}

function createItemCard(item) {
    const itemCard             = document.createElement('div');
    const itemContentContainer = document.createElement('div');
    const left                 = document.createElement('div');
    const right                = document.createElement('div');
    const itemCompleteBtn      = document.createElement('div');
    const itemTitle            = document.createElement('h4');
    const itemDueDate          = document.createElement('p')
    const itemPriority         = document.createElement('p')
    const removeItemBtn        = document.createElement('div');

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

    if(item.dueDate !== ''){
    itemDueDate.textContent = `Due: ${item.dueDate}`;
    }
    // itemPriority.textContent = `Priority: ${item.priority}`;
    

    if(item.isComplete){
        itemCard.classList.add('item-card-complete')
    }
    
    const content = document.createElement('div');
    content.classList = 'item-card-top';
    
    content.appendChild(left);
    content.appendChild(right);
    left.appendChild(itemCompleteBtn);
    left.appendChild(itemContentContainer);
    // right.appendChild(removeItemBtn);
    right.appendChild(itemDueDate);
    itemContentContainer.appendChild(itemTitle);
    // itemContentContainer.appendChild(itemDueDate);
    // itemContentContainer.appendChild(itemPriority);
    itemCard.appendChild(content);

    return itemCard;
}

function createItemCardFlag(item) {
    const itemCard = createItemCard(item);
    const bottom = document.createElement('div');
    bottom.classList.add('item-card-bottom');
    const flag = document.createElement('div');
    flag.classList.add('item-card-flag');
    const flagIcon = document.createElement('div')
    flagIcon.textContent = `🏷️`;
    flagIcon.classList.add('item-card-flag-icon');
    const project = document.createElement('p');
    project.textContent = item.project;
    project.classList.add('item-card-flag-project')

    flag.addEventListener('click', () => {
        renderProject(getProject(item.project));
    })
    bottom.appendChild(flag);
    itemCard.appendChild(bottom);
    flag.appendChild(flagIcon);
    flag.appendChild(project);
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
    // addItemBtn.textContent = 'Add new task'
    // addItemBtn.textContent = '+';
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
    const projectLabel = document.createElement('div');
    projectLabel.classList.add('project-card-project-label');
    projectLabel.textContent = 'Project: '
    const projectCardTitle = document.createElement('h1');
    projectCardTitle.classList.add('project-card-title');
    projectCardTitle.textContent = `${project.title}`;

    projectCardTitle.addEventListener('dblclick', () => {
        // Form is created on dblclick - could write with own function
        const renameTitleForm = document.createElement('form');
        renameTitleForm.id = 'rename-title-form';
        const renameTitleInput = document.createElement('input');
        renameTitleInput.id = 'rename-title-input';
        renameTitleInput.value = project.title;
        renameTitleInput.autofocus = true;
        setWidthFromChars(renameTitleInput);
        
        // renameTitleInput.addEventListener('keypress', (e) => {
        //     renameTitleInput.style.width = `${e.target.value.length}ch`
        // });

        projectCardTitle.style.display = 'none';
        renameTitleForm.appendChild(renameTitleInput)
        projectCardHeader.appendChild(renameTitleForm);

        renameTitleForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newName = renameTitleInput.value;
            getProject(project.title).title = newName;
            renderProject(getProject(project.title));
            updateSidebarMenu();
        
        });

        // Allows user to click item-card-container to submit teh name name instead of enter
        const container = document.getElementsByClassName('project-item-card-container')
        container[0].addEventListener('click', (e) => {
            console.log('sent');
            const newName = renameTitleInput.value;
            getProject(project.title).title = newName;
            renderProject(getProject(project.title));
            updateSidebarMenu();
        }, {once: true});
        
    })

    // const delBtn = document.createElement('button');
    // delBtn.classList.add('delete-project-btn');
    // delBtn.innerText = 'X';
    // delBtn.addEventListener('click', (e) => {
    //     // could be its own removeProject function
    //     removeProject(project);
    //     updatePage();
    // })
    projectCardHeader.appendChild(projectLabel);
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
    const project = getProject(itemToComplete.project);
    const indexOfItem = project.items.findIndex((item) => item.title === itemToComplete.title);
    const firstIndex = findFirstCompletedItem(project);
    itemToComplete.isComplete = true;
    itemToComplete.completedDate = new Date();
    console.log(itemToComplete);
  
    project.items.push(project.items.splice(indexOfItem,1)[0])
      
    updatePage();
}

function findFirstCompletedItem(project) {
    const firstCompleted = project.items.find((item) => item.isComplete);
    console.log('Found first completed: ' + firstCompleted);
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
    addProjectBtn.innerHTML = 'New project';
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

    const right = document.createElement('div');
    right.id = 'header-right';
    right.classList.add('header-section');

    const loadDemoBtn = document.createElement('button');
    loadDemoBtn.classList.add('header-button');
    loadDemoBtn.innerHTML = 'Load demo';
    loadDemoBtn.addEventListener('click', loadDemo);
    

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
    right.appendChild(loadDemoBtn);
    right.appendChild(clearLocalStorageBtn);
    projectCardNav.appendChild(right);
   

    return projectCardNav;
}



function loadDemo() {
    const proj1 = createProject('Housework');
    proj1.addToItems(createItem('Check in with contractors about renovations', 
                                format((add(new Date(), {weeks: 1})), "eee, " + "MMMM " + "dd"),
                                'Medium',
                                'Housework'));
                                
    proj1.addToItems(createItem('Clean out guestroom', 
                                format((add(new Date(), {weeks: 4})), "eee, " + "MMMM " + "dd"),
                                'Low',
                                'Housework'));

    
    proj1.addToItems(createItem('Clean bathroom', 
                                format((add(new Date(), {days: 4})), "eee, " + "MMMM " + "dd"),
                                'High',
                                'Housework'));

    
    proj1.addToItems(createItem('Dust and organize attic shelves', 
                                '',
                                'Low',
                                'Housework'));
                                
    proj1.items.unshift(createItem('Get new belt for laundry machine', 
                                format((add(new Date(), {days: 2})), "eee, " + "MMMM " + "dd"),
                                'Critical',
                                'Housework'));

    const proj2 = createProject('Birdbot v2.0');
    proj2.addToItems(createItem('Determine maximum number of API calls per day', 
                                format((add(new Date(), {weeks: 1})), "eee, " + "MMMM " + "dd"),
                                'High',
                                'Birdbot v2.0'));

        
    proj2.items.unshift(createItem('Start learning React', 
                                '',
                                'Critical',
                                'Birdbot v2.0'));

    proj2.addToItems(createItem('Come up with 5 potential names for the project', 
                                format((add(new Date(), {months: 2, days: 5})), "eee, " + "MMMM " + "dd"),
                                'Medium',
                                'Birdbot v2.0'));

    proj2.addToItems(createItem('Figure out Wikipedia vs. Google for image scraping', 
                                format((add(new Date(), {weeks: 4})), "eee, " + "MMMM " + "dd"),
                                'Low',
                                'Birdbot v2.0'));

    proj2.addToItems(createItem('Ask some bird enthusiasts what they would want', 
                                '',
                                'Medium',
                                'Birdbot v2.0'));


    proj2.addToItems(createItem('Determine maximum number of API calls per day', 
                                format((add(new Date(), {weeks: 1})), "eee, " + "MMMM " + "dd"),
                                'High',
                                'Birdbot v2.0'));

    
    proj2.addToItems(createItem('Book consultation with UX connect', 
                                format((add(new Date(), {weeks: 4})), "eee, " + "MMMM " + "dd"),
                                'Low',
                                'Birdbot v2.0'));

    proj2.addToItems(createItem('Authentication?', 
                                format((add(new Date(), {months: 2, days: 5})), "eee, " + "MMMM " + "dd"),
                                'Low',
                                'Birdbot v2.0'));

        
    proj2.items.unshift(createItem('Research map interface options', 
                                format((add(new Date(), {weeks: 1})), "eee, " + "MMMM " + "dd"),
                                'Critical',
                                'Birdbot v2.0'));

    proj2.addToItems(createItem('Design hats', 
                                format((add(new Date(), {years: 1, months: 2, days: 5})), "eee, " + "MMMM " + "dd"),
                                'Low',
                                'Birdbot v2.0'));

    proj2.addToItems(createItem('Hosting budget', 
                                format((add(new Date(), {years: 1})), "eee, " + "MMMM " + "dd"),
                                'High',
                                'Birdbot v2.0'));

        
    proj2.addToItems(createItem('Figure out how long to retain calls to db - session?', 
                                format((add(new Date(), {weeks: 4})), "eee, " + "MMMM " + "dd"),
                                'Low',
                                'Birdbot v2.0'));

    proj2.addToItems(createItem('Contact Angela', 
                                format((add(new Date(), {months: 2, days: 5})), "eee, " + "MMMM " + "dd"),
                                'Low',
                                'Birdbot v2.0'));

    proj2.addToItems(createItem('Finalize branding direction', 
                                format((add(new Date(), {weeks: 1})), "eee, " + "MMMM " + "dd"),
                                'High',
                                'Birdbot v2.0'));

        
    proj2.addToItems(createItem('See what else people have done with the eBird API', 
                                format((add(new Date(), {weeks: 4})), "eee, " + "MMMM " + "dd"),
                                'Low',
                                'Birdbot v2.0'));

    proj2.addToItems(createItem('Talk to Trevor about color schemes', 
                                '',
                                'Low',
                                'Birdbot v2.0'));

    proj2.items.unshift((createItem('Talk to some birds', 
                                    '',
                                    'Critical',
                                    'Birdbot v2.0')));

   
        

    
                                

    _projects = [proj1, proj2];
    updatePage();
    renderProject(proj1);
    makeProjectBold();

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

    // const calendarModal = createCalendarModal();
    // calendarModal.id = 'calendar-modal';
    // addItemModal.appendChild(calendarModal);


    const calendarBtn = document.createElement('div');
    const calendarImg = document.createElement('img');
    calendarImg.src = calendarIcon;
    calendarImg.width = '30';
    calendarImg.height = '30';
    calendarBtn.appendChild(calendarImg);
    // calendarBtn.textContent = '📅';
    // calendarBtn.innerHTML = new Image(calendarIcon);
    calendarBtn.classList.add('modal-button')
    calendarBtn.id = 'calendar-modal-calendar-btn';
    calendarBtn.addEventListener('click', () => {
        const calendarModal = document.getElementById('calendar-modal');
        calendarModal.classList.toggle('calendar-modal-active');
        if(calendarModal.style.display === 'block'){
            calendarModal.style.display = 'none';
        } else {
            calendarModal.style.display = 'block';
        }
    })
    // calendarBtn.addEventListener('mouseover', () => {
    //     calendarModal.classList.toggle('calendar-modal-active');
    //     if(calendarModal.style.display === 'block'){
    //         calendarModal.style.display = 'none';
    //     } else {
    //         calendarModal.style.display = 'block';
    //     }
    // })

    // itemDueDateInput.type      = 'date';
    // itemDueDateInput.id        = 'new-item-duedate';
    // itemDueDateInput.name      = 'itemDueDate';
    const priorityModal = createPriorityModal();
    addItemModal.appendChild(priorityModal);



    const priorityBtn = document.createElement('div');
    priorityBtn.classList.add('modal-button')
    const priorityImg = document.createElement('img');
    priorityImg.src = priorityIcon;
    priorityImg.width = '30';
    priorityImg.height = '30';
    priorityBtn.appendChild(priorityImg);

    priorityBtn.id = 'priority-modal-priority-btn';
    priorityBtn.addEventListener('click', () => {
        priorityModal.classList.toggle('priority-modal-active');
        if(priorityModal.style.display === 'block'){
            priorityModal.style.display = 'none';
        } else {
            priorityModal.style.display = 'block';
        }
    })

    // const dropdownPriority = document.createElement('select');
    // dropdownPriority.id = 'selectPriority';
    // const lowPriority = document.createElement('option');
    // lowPriority.value = 'Low';
    // lowPriority.innerText = 'Low';
    // const mediumPriority = document.createElement('option');
    // mediumPriority.value = 'Medium';
    // mediumPriority.innerText = 'Medium';
    // const highPriority = document.createElement('option');
    // highPriority.value = 'High';
    // highPriority.innerText = 'High';
    // const critPriority = document.createElement('option');
    // critPriority.value = 'Critical';
    // critPriority.innerText = 'Critical';

    // dropdownPriority.appendChild(lowPriority)
    // dropdownPriority.appendChild(mediumPriority)
    // dropdownPriority.appendChild(highPriority)
    // dropdownPriority.appendChild(critPriority)
    
    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.id = 'item-modal-submit-btn'
    submitBtn.innerText = 'Add task'

    const project = document.createElement('input');
    project.type = 'text';
    project.id = 'selectProject';
    project.classList.add('no-display');
    project.value = _lastOpenedProject;

    addItemForm.appendChild(project);
    formTop.appendChild(itemTitleInput);
    formBottom.appendChild(calendarBtn);
    formBottom.appendChild(priorityBtn);
    formBottom.appendChild(submitBtn);
    addItemForm.appendChild(formTop);   
    addItemForm.appendChild(formBottom);

    addItemForm.onsubmit = addItem;
    addItemModal.appendChild(addItemForm);
    
    return addItemModal;
}

function createCalendarModal() {
    const modal = document.createElement('div');
    modal.id = 'calendar-modal';
    const form = document.createElement('form');
    form.id = 'calendar-form';

    let dueDate;

    const btnContainer = document.createElement('div');
    btnContainer.id = 'calendar-modal-btn-container';

    const calendar = document.createElement('input');
    calendar.type = 'date';
    calendar.id = 'modal-calendar';
    calendar.placeholder = 'Due date';

    const todayBtn = document.createElement('button');
    todayBtn.textContent = 'Today'
    todayBtn.type = 'button';
    todayBtn.id = 'today-btn';
    todayBtn.value = 'today';
    todayBtn.addEventListener('click', () => {
        todayBtn.classList.toggle('active');
        calendar.value = format(new Date(), 'yyyy' + '-' + 'MM' + '-' + 'dd');
    })

    const tomorrowBtn = document.createElement('button');
    tomorrowBtn.textContent = 'Tomorrow';
    tomorrowBtn.type = 'button';
    tomorrowBtn.id = 'tomorrow-btn';
    tomorrowBtn.value = 'tomorrrow';
    tomorrowBtn.addEventListener('click', () => {
        tomorrowBtn.classList.toggle('active');
        calendar.value = format((add(new Date(), {days: 1})), 'yyyy' + '-' + 'MM' + '-' + 'dd');

    })

    const nextWeekBtn = document.createElement('button');
    nextWeekBtn.textContent = 'Next week'
    nextWeekBtn.type = 'button';
    nextWeekBtn.id = 'next-week-btn';
    nextWeekBtn.value = 'next-week';
    nextWeekBtn.addEventListener('click', () => {
        nextWeekBtn.classList.toggle('active');
        calendar.value = format((add(new Date(), {weeks: 1})), 'yyyy' + '-' + 'MM' + '-' + 'dd');    })

    btnContainer.appendChild(todayBtn);
    btnContainer.appendChild(tomorrowBtn);
    btnContainer.appendChild(nextWeekBtn);
    form.appendChild(btnContainer);
    form.appendChild(calendar);
    modal.appendChild(form);

    return modal;
}

function createPriorityModal() {
    const modal = document.createElement('div');
    modal.id = 'priority-modal';
    const form = document.createElement('form');
    form.id = 'priority-form';

    const priorityInput = document.createElement('input');
    priorityInput.classList.add('no-display');
    priorityInput.id = 'priority-modal-input';

    const btnContainer = document.createElement('div');
    btnContainer.id = 'priority-modal-btn-container';

    const lowBtn = document.createElement('button');
    lowBtn.type = 'button';
    lowBtn.textContent = 'Low';
    lowBtn.classList.add('priority-modal-btn');
    lowBtn.id = 'priority-modal-low-btn';
    lowBtn.addEventListener('click', () => {
        priorityInput.value = 'Low';
    })
    
    const mediumBtn = document.createElement('button');
    mediumBtn.type = 'button';
    mediumBtn.textContent = 'Medium';

    mediumBtn.classList.add('priority-modal-btn');
    mediumBtn.id = 'priority-modal-medium-btn';
    mediumBtn.addEventListener('click', () => {
        priorityInput.value = 'Medium';
    })
    
    const highBtn = document.createElement('button');
    highBtn.type = 'button';
    highBtn.textContent = 'High';

    highBtn.classList.add('priority-modal-btn');
    highBtn.id = 'priority-modal-high-btn';
    highBtn.addEventListener('click', () => {
        priorityInput.value = 'High';
    })
    
    const criticalBtn = document.createElement('button');
    criticalBtn.type = 'button';
    criticalBtn.textContent = 'Critical';

    criticalBtn.classList.add('priority-modal-btn');
    criticalBtn.id = 'priority-modal-critical-btn';
    criticalBtn.addEventListener('click', () => {
        priorityInput.value = 'Critical';
    })

    form.appendChild(priorityInput);
    btnContainer.appendChild(lowBtn);
    btnContainer.appendChild(mediumBtn);
    btnContainer.appendChild(highBtn);
    btnContainer.appendChild(criticalBtn);
    form.appendChild(btnContainer);
    modal.appendChild(form);

    return modal;
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
    let dueDate  = processCalendarFormData();
    console.log('-----------------')
    console.log(dueDate)
    if(dueDate){
        dueDate = format(parseISO(dueDate), ("eee, " + "MMMM " + "dd"));
    }
    const priority = document.getElementById('priority-modal-input').value
    const project  = document.getElementById('selectProject').value

    return createItem(title, dueDate, priority, project)
}

function processCalendarFormData() {
    const date = document.getElementById('modal-calendar').value;
    // if(date) {
    //     date = format(parseISO(dueDate), ("eee, " + "MMMM " + "dd"));
    // }
    return date;
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
        project.items = project.items.filter((item) => item.title !== itemToRemove.title);
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
        const main = document.getElementById('main');
        const placeholder = document.createElement('div');
        placeholder.textContent = 'Currently no projects';
        return main.appendChild(placeholder);
    }
    _lastOpenedProject = project.title;

    const main = document.getElementById('main');
    main.appendChild(createProjectCard(project));
    saveLocal();
}

function renderAllItems() {
    const main = document.getElementById('main');
    const itemContainer = document.createElement('div');
    itemContainer.id = 'all-items-container';

    resetPage();
    for(let project of _projects){
        project.items.map((item) => itemContainer.appendChild(createItemCardFlag(item)));
    }
    main.appendChild(itemContainer);
    // updatePage();
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

function makeProjectBold(){
    const projects = document.getElementsByClassName('sidebar-projects-dropdown-option');
    for(let i = 0; i < projects.length; i++){
        projects[i].classList.remove('sidebar-projects-dropdown-option-active');
        console.log(projects[i]);
        if(projects[i].innerHTML == _lastOpenedProject){
            console.log('Last open');
            projects[i].classList.add('sidebar-projects-dropdown-option-active')
        }
    }
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
        if(projects.style.display === 'none') {
            projects.style.display = 'flex';
        } else {
            projects.style.display = 'none';
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
        projOption.addEventListener('click', (e) => {
            // projOption.classList.toggle('sidebar-projects-dropdown-option-active');
            renderProject(project);
            makeProjectBold();
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
        if(tasks.style.display === 'none') {
            tasks.style.display = 'flex';
        } else {
            tasks.style.display = 'none';
        }
    })

    menuContainer.appendChild(taskMenuTitle);
    const taskMenu = document.createElement('ul');
    taskMenu.id = 'sidebar-tasks-dropdown';

    const tasksAll = document.createElement('li');
    tasksAll.classList.add('sidebar-tasks-dropdown-option');
    tasksAll.id = 'sidebar-tasks-all';
    tasksAll.innerHTML = `All tasks`
    tasksAll.addEventListener('click', renderAllItems);
    const tasksDay = document.createElement('li');
    tasksDay.classList.add('sidebar-tasks-dropdown-option');
    tasksDay.id = 'sidebar-tasks-within-day';
    tasksDay.innerHTML = `Due within the <em>day</em>`
    const tasksWeek = document.createElement('li');
    tasksWeek.classList.add('sidebar-tasks-dropdown-option');

    tasksWeek.id = 'sidebar-tasks-within-week';
    tasksWeek.innerHTML = `<p>Due within the <em>week</em>`
    const tasksMonth = document.createElement('li');
    tasksMonth.classList.add('sidebar-tasks-dropdown-option');

    tasksMonth.id = `sidebar-tasks-within-month`;
    tasksMonth.innerHTML = `<p>Due within the <em>month</em>`

    taskMenu.appendChild(tasksAll);
    taskMenu.appendChild(tasksDay);
    taskMenu.appendChild(tasksWeek);
    taskMenu.appendChild(tasksMonth);

    menuContainer.appendChild(taskMenu);
    sidebar.appendChild(menuContainer);

    makeProjectBold();
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
    content.appendChild(createCalendarModal());


}

const updateSidebarMenu = () => {
    const sidebarMenu = document.getElementById('sidebar-menus-container');
    if(sidebarMenu === null){
        return createSidebarMenus;
    } else {
        sidebarMenu.innerHTML = '';
        createSidebarMenus();
    }
}

function setWidthFromChars(input){
    return input.style.width = (input.value.length-0.5) + 'ch';
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