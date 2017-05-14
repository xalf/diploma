(function(){
	var adminCtrl = function($uibModal, cafeData, authentication){
		var vm = this;
		
		var emptyContact = {
			value: "",
			name: "",
			isLink: false
		};
		
		//начальные значения
		vm.newTimetable = {};
		vm.newContact = jQuery.extend({},emptyContact);
		vm.adminLogin = authentication.isLoggedIn('admin');
		authentication.getAdminInfo().then(function(data){
			vm.cafeid = data.data.cafeid;
			cafeData.getCafeById(vm.cafeid).then(function(data){
				vm.cafeForm = data.data;
			}, function(e){
				console.log(e);
			});
		}, function(e){
			vm.cafeForm = {};
			vm.cafeForm.contacts = [];
			vm.cafeForm.timetable = [{
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
		});
		
		//Статичные данные
		vm.cuisineNames = ["Французская кухня", "Итальянская кухня", "Японская кухня", "Китайская кухня", "Русская кухня", "Грузинская кухня","Вьетнамская кухня"];
		vm.paymentNames = ["Наличные", "Банковская карта", "Через интернет"];
		
		
		
		//методы
		vm.addContact = function(){
			vm.cafeForm.contacts.push(vm.newContact);
			vm.newContact = jQuery.extend({},emptyContact);
		};
		vm.addInTimetable = function(){
			for(var i = 0; i < vm.newTimetable.day.length; i++)
				vm.cafeForm.timetable.forEach(function(item, j, arr){
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
			if(vm.cafeid)
				cafeData.updateCafe(vm.cafeid, vm.cafeForm);
			else
				cafeData.addCafe(vm.cafeForm);
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