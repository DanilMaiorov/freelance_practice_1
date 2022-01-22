'use strict'
const startBtnBlock = document.querySelector('.mt-5')//блок с кнопками фрилансер/заказчик

const blockCustomer = document.querySelector('#block-customer')//блок заказчика
const blockFreelancer = document.querySelector('#block-freelancer')//блок фрилансера
const blockChoice = document.querySelector('#block-choice')
const btnExit = document.querySelector('#btn-exit')//кнопка закрытия окон заказчика/фрилансера

const formCustomer = document.querySelector('#form-customer') //форма заполнения заказчика

const ordersTable = document.querySelector('#orders') //сама таблица с заказами
const modalOrder = document.querySelector('#order_read')
const modalOrderActive = document.querySelector('#order_active')
const modalArr = [modalOrder, modalOrderActive]
//modalOrder.style.display = 'block'
const modalClose = document.querySelector('.close')//крестик закрытия модалок
const orders = [] //массив для пуша созданных заказов

const renderOrders = () => { //функция для отрисовки верстки при каждом новом заказе
    //ставим += потому что не хотим, чтобы старое пропало, а только добавлялось, потому что иннерШТМЛ
    ordersTable.textContent = '' //убираем дублирование добавленных строк
    orders.forEach((order, index) => {
    ordersTable.innerHTML += `
            <tr class="order" data-number-order="${index}">
                <td>${index + 1} </td>
                <td>${order.title}</td>
                <td class=${order.currency}></td>
                <td>${order.deadline}</td>
            </tr>`
    }) //data-number-order это дата атрибут, который получаем через dataset
    //numder-order = numberOrder
    
}
const openModal = (numberOrder) => {
    const order = orders[numberOrder] //создаем переменную с заказом, в который передаем массив, который будет выводить оьъект с определенным номером
    console.dir(order);
    const modal = order.active ? modalOrderActive : modalOrder//получаем модальное окно в зависимости от условий, если jrder.active тру, то отроется модалка с активным классом

    //нужно получить все данные с модального окна
    const modalTitle = document.querySelector('.modal-title')
    const modalName = document.querySelector('.firstName')
    const modalEmail = document.querySelector('.email')
    const modalDescription = document.querySelector('.description')
    const modalDeadline = document.querySelector('.deadline')
    const modalCurrency = document.querySelector('.currency_img')
    const modalCount = document.querySelector('.count')
    const modalPhone = document.querySelector('.phone')
    console.dir(modalPhone);

    modalTitle.textContent = order.title
    modalName.textContent = order.firstName
    modalEmail.textContent = order.email
    modalDescription.textContent = order.description
    modalDeadline.textContent = order.deadline
    modalCurrency.innerHTML = `<span class="img__radio img__radio_${order.currency}"></span>`
    modalCount.textContent = order.amount
    modalPhone.value = order.phone
    modal.style.display = 'block'
}
ordersTable.addEventListener('click', (e) => {
    const target = e.target
    const targetOrder = target.closest('.order')
    
    if(targetOrder) { //если таргет ордер существует, то
        openModal(targetOrder.dataset.numberOrder) //вызываем функцию и передадим в неё номер заказа
    }
})
startBtnBlock.addEventListener('click', (e) => {
    const target = e.target
    if(target.closest('#customer')) {
        blockCustomer.style.display = 'block'
        blockChoice.style.display = 'none'
        btnExit.style.display = 'block'
    }
    if(target.closest('#freelancer')) {
        renderOrders() 
        blockFreelancer.style.display = 'block'
        blockChoice.style.display = 'none'
        btnExit.style.display = 'block'
    }
})
btnExit.addEventListener('click', () => {
    blockChoice.style.display = 'block'
    blockFreelancer.style.display = 'none'
    blockCustomer.style.display = 'none'
    btnExit.style.display = 'none'
})
formCustomer.addEventListener('submit', (e) => { //можем повесить на всю форму событие submit, но работать оно будет через e
    e.preventDefault()
    const obj = {}
    Array.from(formCustomer.elements).forEach(elem => {
        if ((elem.tagName === 'INPUT' && elem.type !== 'radio') || 
        (elem.type === 'radio' && elem.checked) || elem.tagName === 'TEXTAREA') { //если тегнейм инпут и не радио, или радио и чекед, то
            obj[elem.name] = elem.value //добавляем значения елементов со свойством нейм в объект, ВНЕ ПЕРЕБОРА БУДЕТ ОБЪЕКТ С ОДНИМ ЗНАЧЕНИЕМ ОДНОГО(КАЖДОГО ИНПУТА)
        }
/*         if(elem.type !== 'radio') {
            elem.value = ''
        } */
    })
/*     for (let elem of formCustomer.elements) { //let - что мы хотим переберать, of - в чем мы перебираем
        if ((elem.tagName === 'INPUT' && elem.type !== 'radio') 
        || (elem.type === 'radio' && elem.checked) || elem.tagName === 'TEXTAREA') { //если тегнейм инпут и не радио, или радио и чекед, то
            obj[elem.name] = elem.value //добавляем значения елементов со свойством нейм в объект, ВНЕ ПЕРЕБОРА БУДЕТ ОБЪЕКТ С ОДНИМ ЗНАЧЕНИЕМ ОДНОГО(КАЖДОГО ИНПУТА)
        }
        if(elem.type !== 'radio') {
            elem.value = ''
        }
    } */
    orders.push(obj);
    console.log(orders);
    formCustomer.reset()
    //e.target.reset()
})
modalClose.addEventListener('click', () => {
    modalArr.forEach(modal => {
        modal.style.display = 'none'
    })
})
//открытие нужных разделов страницы по клику
//открытие модальных окон и закрытие модальный окон
//формирование массива с объектами с карточками заказа
//рендер карточек в общую таблицу

