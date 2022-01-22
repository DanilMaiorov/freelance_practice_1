'use strict'
const startBtnBlock = document.querySelector('.mt-5')//блок с кнопками фрилансер/заказчик
const blockCustomer = document.querySelector('#block-customer')//блок заказчика
const blockFreelancer = document.querySelector('#block-freelancer')//блок фрилансера
const blockChoice = document.querySelector('#block-choice')
const btnExit = document.querySelector('#btn-exit')//кнопка закрытия окон заказчика/фрилансера
const formCustomer = document.querySelector('#form-customer') //форма заполнения заказчика
const ordersTable = document.querySelector('#orders') //сама таблица с заказами
const modalOrder = document.querySelector('#order_read')//неактивная модалка
const modalOrderActive = document.querySelector('#order_active')//активная модалка
//modalOrder.style.display = 'block'
//modalOrderActive.style.display = 'block'

const orders = JSON.parse(localStorage.getItem('freeOrders')) || []//массив для пуша созданных заказов, изначально был пустой, но в дальнейшем запарасили в него данный с локалсторэджа

//делаем хранение данных в локалсторэдж
const toStorage = () => {
    localStorage.setItem('freeOrders', JSON.stringify(orders))
}
const calcDeadline = (deadline) => {
    let dateStop = new Date(deadline).getTime()
    let dateNow = new Date().getTime()
    let timeRemaining = (dateStop - dateNow) / 1000
    let days = Math.floor(timeRemaining / 60 / 60 / 24)

/*     let updateTimer = setInterval(() => {
        days = (days < 10) ? '0' + days : days
        if(days === 0) {
            clearInterval(updateTimer)
            days = 0
        } 
        if(days < 0) {
            days = 'Просрок'
        }
    }, 1000); */
    const declOfNum = (days, titles) => {
        return titles[(days % 10 === 1 && days % 100 !== 11) ? 0 : days % 10 >= 2 && days % 10 <= 4 && (days % 100 < 10 || days % 100 >= 20) ? 1 : 2]
    }
    if(days <= 1){
        return days + ' ' + declOfNum(days, ['день', 'дня', 'дней']) + ' !!!ЭТО ПОСЛЕДНИЙ ДЕНЬ!!!'
    } else {
        return days + ' ' + declOfNum(days, ['день', 'дня', 'дней']);
    }
}
const handlerModal = (e) => { //функция для закрытия модалок и активации кнопок внутри
    const target = e.target
    const modal = target.closest('.order-modal')//получаем сами модалки
    //нужно получить order по id(numberOrder) модалки, который присвоили в функции openModal
    const order = orders[modal.numberOrder] //заказ будет равен заказу из массива под определенным номером, модальное окно которого вызвали

    const baseAction = () => {
        modal.style.display = 'none'
        toStorage()
        renderOrders()
    }
    if(target.closest('.close') || target === modal) {
        modal.style.display = 'none'
    }
    if(target.closest('.get-order')) {//если так
        order.active = true //то при следующем вызове модалки она уже будет другой, с классом active
        baseAction() //делаем отрисовку с измененным классом строки? в функции рендер при этом нужно прописать условие на изменение классов
    }
    if(target.id === 'capitulation') {//bp верстки  //если так
        order.active = false //то при следующем вызове модалки она уже будет другой, без класса active
        baseAction() //делаем отрисовку с измененным классом строки
    }
    if(target.id === 'ready') {//если так
        //ищем нужный индекс заказа в массиве через indexOf()
        //и теперь нам нужно удалить это значение, чтобы не осталось дырки, используем метод splice
        orders.splice(orders.indexOf(order), 1)//1 - индекс элемента, 2 сколько нужно удалить
        baseAction() //делаем отрисовку с измененным массивом
    }
}
const renderOrders = () => { //функция для отрисовки верстки при каждом новом заказе
    //ставим += потому что не хотим, чтобы старое пропало, а только добавлялось, потому что иннерШТМЛ
    ordersTable.textContent = '' //убираем дублирование добавленных строк
    orders.forEach((order, index) => {
    ordersTable.innerHTML += `
            <tr class="order ${order.active ? 'taken' : ''}" data-number-order="${index}">
                <td>${index + 1} </td>
                <td>${order.title}</td>
                <td class=${order.currency}></td>
                <td>${calcDeadline(order.deadline)}</td>
            </tr>`
    }) //data-number-order это дата атрибут, который получаем через dataset
    //numder-order = numberOrder
    
}
const openModal = (numberOrder) => {
    const order = orders[numberOrder] //создаем переменную с заказом, в который передаем массив, который будет выводить оьъект с определенным номером
    const { title, firstName, email, description, currency, deadline, amount, phone, active = false } = order //деструктуризация 
    const modal = active ? modalOrderActive : modalOrder//получаем модальное окно в зависимости от условий, если jrder.active тру, то отроется модалка с активным классом
    //нужно получить все данные с модального окна
    //чтобы получить данные с обоих модалок, то нужно искать не документе, в модалке
    const modalTitle = modal.querySelector('.modal-title')
    const modalName = modal.querySelector('.firstName')
    const modalEmail = modal.querySelector('.email')
    const modalDescription = modal.querySelector('.description')
    const modalDeadline = modal.querySelector('.deadline')
    const modalCurrency = modal.querySelector('.currency_img')
    const modalCount = modal.querySelector('.count')
    //у первой модалки нет телефона, то надо разделить сущности
    const modalPhone = modal.querySelector('.phone')

    modal.numberOrder = numberOrder//дадим вызываемой модалке id(numberOrder) как у заказа
    modalTitle.textContent = title
    modalName.textContent = firstName
    modalEmail.textContent = 'mailto:' + email //добавление кликабельного имейла
    modalEmail.href = email
    modalDescription.textContent = description
    modalDeadline.textContent = calcDeadline(deadline)
    modalCurrency.className = 'currency_img'
    modalCurrency.innerHTML = `<span class="img__radio img__radio_${currency}"></span>`
    modalCount.textContent = amount
    //у первой модалки нет телефона, то надо разделить сущности
    //если у модалки есть блок с телефоном, то даем абрибут и данные ему данные, иначе пусто
    modalPhone ? modalPhone.href = 'tel:' + phone : '' //добавление кликабельного телефона
    modal.style.display = 'flex'
    //через делегирование сделаем закрытие модалки и работу кнопок внутри
    modal.addEventListener('click', handlerModal)


}
ordersTable.addEventListener('click', (e) => { //клик по таблице
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
    toStorage()
    //e.target.reset()
})

//открытие нужных разделов страницы по клику
//открытие модальных окон и закрытие модальный окон
//добавление контента в формы модального окна включая имейл и картинку
//формирование массива с объектами с карточками заказа
//рендер карточек в общую таблицу

