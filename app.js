//BUDGET CONTROLLER

var budgetController = (function() {
 
var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
};

var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
};

   var data = {
       allItems: {
           exp: [],
           inc: []
       }, 
       totals: {
           exp: 0,
           inc: 0
       }
   };

   return {
       addItem: function(type, des, val){
        var newItem, ID;   
           
            //[1, 2, 3, 4, 5] You want to select the last element in the array and add 1 to it for a new id
            //ID = last id + 1
            //Create new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            
            //Create new item based on 'inc' or 'exp' type
            if (type === 'exp') {
                newItem =  new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            //Push it into data structure
        data.allItems[type].push(newItem); 
            //Return new element
        return newItem;  
       },
       testing: function() {
           console.log(data);
       }
   };

})(); 


//UI CONTROLLER
var UIController = (function(){

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn', 
        incomeContainer: '.income__list', 
        expensesContainer: '.expenses__list'
    }

    return {
        getInput: function() {

            return {
                type: document.querySelector(DOMstrings.inputType).value, //Will be either inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            };
        },

        addListItem: function(obj, type) {
            var html, newHTML, element; 
            //Create HTML string with placeholder text  
             
             if (type === 'inc') {
                 element = DOMstrings.incomeContainer;

                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
             } else if (type === 'exp') {
                 element = DOMstrings.expensesContainer;

                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><class="ion-ios-close-outline"></i></button></div></div></div>';
             }
             

            
              //Replace placeholder text with data from object
             newHTML = html.replace('%id%', obj.id);
             newHTML = newHTML.replace('%description%', obj.description);
             newHTML = newHTML.replace('%value%', obj.value);

             //Before end refers to adding the html string to the element as the last child
             document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);
              //Insert the HTML string into the DOM


        },

        clearFields: function(){
            var fields, fieldsArr;

           fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

           //fields is a node list, not array, so you need to use .call on the Array prototype to trick it
           fieldsArr = Array.prototype.slice.call(fields);

           fieldsArr.forEach( function(current, index, array) {
             //The items in the fieldsArr will be HTML input elements, which is why you can call .value    
            current.value = '';
           });
           fieldsArr[0].focus();
        },

        getDOMstrings: function() {
            return DOMstrings;
    }
};


})();


//GLOBAL APP CONTROLLER

var controller = (function(budgetCtrl, UICtrl){

    var setupEventListeners = function() {

        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event) {
                 if (event.keyCode === 13 || event.which === 13) {
                     ctrlAddItem();
                 }
        });
    };


    var ctrlAddItem = function() {
    //1.  Get the field input data
        var input, newItem;

         input = UICtrl.getInput();

        //2.  Add the item to the budget controller
         newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        //3. Add the new item to the UI
        UICtrl.addListItem(newItem, input.type);

        //4. Clear the fields

        UICtrl.clearFields();
        //5.  Calculate the budget

        //6.  Display the budget on the UI
        
        };

    return {
        init: function() {
            console.log('Application has started');
            setupEventListeners();
        }
    };

})(budgetController, UIController);

controller.init();