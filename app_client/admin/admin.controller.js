(function(){
	var adminCtrl = function($uibModal, cafeData, authentication){
		var vm = this;
		
		var emptyContact = {
			value: "",
			name: "",
			isLink: false
		};
		
		//начальные значения
		vm.cafeForm = {};
		vm.newTimetable = {};
		vm.cafeForm.contacts = [];
		vm.newContact = jQuery.extend({},emptyContact);
		
		//Статичные данные
		vm.cuisineNames = ["Французская кухня", "Итальянская кухня", "Японская кухня", "Китайская кухня", "Русская кухня", "Грузинская кухня","Вьетнамская кухня"];
		vm.paymentNames = ["Наличные", "Банковская карта", "Через интернет"];
		vm.cafeForm.days = [{
			number: 1,
			name: 'Пн',
			isChoice: false
		},{
			number: 2,
			name: 'Вт',
			isChoice: false
		},{
			number: 3,
			name: 'Ср',
			isChoice: false
		},{
			number: 4,
			name: 'Чт',
			isChoice: false
		},{
			number: 5,
			name: 'Пт',
			isChoice: false
		},{
			number: 6,
			name: 'Сб',
			isChoice: false
		},{
			number: 7,
			name: 'Вс',
			isChoice: false
		}];
		
		
		
		//методы
		vm.addContact = function(){
			vm.cafeForm.contacts.push(vm.newContact);
			vm.newContact = jQuery.extend({},emptyContact);
		};
		vm.addInTimetable = function(){
			for(var i = 0; i < vm.newTimetable.day.length; i++)
				vm.cafeForm.days.forEach(function(item, j, arr){
					if(item.number == vm.newTimetable.day[i]){
						item.isChoice = true;
						item.closeTime = vm.newTimetable.closeTime;
						item.openTime = vm.newTimetable.openTime;
					}
				});
			vm.newTimetable.openTime = null;
			vm.newTimetable.closeTime = null;
			vm.newTimetable.day = null;
		};
		vm.deleteContact = function(contact){
			vm.cafeForm.contacts.pop(contact);
		};
		vm.deleteDay = function(day){
			day.isChoice = false;
			day.openTime = null;
			day.closeTime = null;
		};
		vm.onSubmit = function(){
			console.log(vm.cafeForm);
			cafeData.updateCafe(vm.cafeForm);
		};
		
		
		//тестовые данные
		var test = new Date();
		vm.orders = [
			{
				table: {
					number: 4
				},
				customer: "Колян",
				date: test.setDate(test.getDate()+7),
				dateEnd: test.setHours(test.getHours()+2)
			},
			{
				table: {
					number: 2
				},
				customer: "Вован",
				date: test.setDate(test.getDate()-2),
				dateEnd: test.setHours(test.getHours()+1)
			}
		];
	};

	angular.module('cafeClientApp')
		.controller("adminCtrl", ['$uibModal', 'cafeData', 'authentication', adminCtrl]);
})();