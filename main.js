const workspace = $('.workspace');
const addTask = $('#quickAdd');

let currentDate = new Date();
let currentDay = currentDate.getDate() < 10 ? '0' + currentDate.getDate() : currentDate.getDate();
let currentMonth = (currentDate.getMonth()+1) < 10 ? '0' + (currentDate.getMonth()+1) : (currentDate.getMonth()+1);
let strCurrentDate = currentDay + "/" + currentMonth + "/" + currentDate.getFullYear();

let markPriority = function(event) {
    let element = $(event.currentTarget);
    let elementParent = element.parent();
    let elementParentCard = element.parents('.task-card');
    let selectedPriorityId = element.attr('id');
    elementParent.find('.priority').removeClass('active');
    elementParentCard.attr('class','task-card ' + selectedPriorityId);
    element.addClass('active');
};

let showEditMenu = function(event) {
    let element = $(event.currentTarget);
    let elementParent = element.parent();

    if (!element.hasClass('active')) {
        element.addClass('active');
        elementParent.append(
            '<div class="edit-menu">' +
                '<div class="input-group">' +
                    '<label for="taskName">Task name</label>' +
                    '<input class="new-task" type="text" id="taskName" name="taskName" placeholder="Type task name" />' +
                '</div>' +
                '<div class="input-group">' +
                    '<label>Select priority' +
                        '<div class="btn-group">' +
                            '<button class="priority" id="low">Low</button>' +
                            '<button class="priority" id="medium">Medium</button>' +
                            '<button class="priority" id="high">High</button>' +
                        '</div>' +
                    '</label>' +
                '</div>' +
                '<div class="input-group">' +
                    '<label for="taskDeadline">Deadline</label>' +
                    '<input type="text" id="datepicker" size="30" name="taskDeadline" placeholder="DD/MM/YYYY">' +
                '</div>' +
            '</div>'
        );
        let inputName = elementParent.find('.edit-menu #taskName');
        let menuPriority = elementParent.find('.edit-menu .priority');
        let deadlineDate = elementParent.find('.edit-menu #datepicker');
        let savedName = elementParent.find('.task-content');
        let savedDate = elementParent.find('.deadline');
        let editMenu = elementParent.find('.edit-menu');

        //Add events to edit menu input
        inputName.on('keyup', function(){
            savedName.text(inputName.val());
        }.bind(this));

        //init datepicker
        $("input#datepicker").datepicker({
            beforeShow : function(textbox, instance){
                elementParent.find('.edit-menu').append($('#ui-datepicker-div'));
                $('#ui-datepicker-div').hide();
            }
        });
        
        // fill inputs with card info
        inputName.val(savedName.text());
        deadlineDate.val(savedDate.text());
        if (elementParent.hasClass('medium')) {
            elementParent.find('.edit-menu #medium').addClass('active');
        } else if (elementParent.hasClass('low')) {
            elementParent.find('.edit-menu #low').addClass('active');
        } else if (elementParent.hasClass('high')) {
            elementParent.find('.edit-menu #high').addClass('active');
        }
        //add priority buttons events
        menuPriority.on('click', markPriority)

        deadlineDate.on('change', function(){
            savedDate.text(deadlineDate.val());
        })

        // Hide edit menu when clicked outside
        $(document).mouseup(function(e) {
            let eventTarget = $(e.target);
            let container = elementParent.find('.edit-menu');
            let datepickerCont = $('#ui-datepicker-div');
            if (!container.is(e.target) && container.has(e.target).length === 0) 
            {
                container.remove();
                $('.task-options').removeClass('active');
            }
        });

        $(document).on('keyup', function(event){
            let keyUpCode = event.keyCode;
            let container = elementParent.find('.edit-menu');
            let datepickerCont = $('#ui-datepicker-div');
            if (keyUpCode == 27) {
                container.remove();
                $('.task-options').removeClass('active');
            }
        })

    } else {
        element.removeClass('active');
        $('.edit-menu').remove();
    }
}

let addNewTask = function(event) {
    let pressedKey = event.keyCode;
    if (pressedKey == 13 && addTask.val()) {
        workspace.prepend(
            '<div class="task-card medium">' +
                '<div class="task-options"></div>' +
                '<div class="delete"></div>' +
                '<div class="deadline">' + strCurrentDate + '</div>' +
                '<div class="task-content">' + addTask.val() + '</div>' +
            '</div>'
        )
        addTask.val("");
        $('.task-options').off();
        $('.task-options').on('click', showEditMenu)
        $('.delete').off();
        $('.delete').on('click', function(event){
            let deleteBtn = $(event.currentTarget);
            deleteBtn.parent().css('opacity','0')
            setTimeout(function(){deleteBtn.parent().remove()}, 230);
        })
        console.log(addTask.val())
    }
}

addTask.on('keypress', addNewTask);