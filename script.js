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

const orders = JSON.parse(localStorage.getItem('freeOrders')) || []//массив для пуша созданных заказов, изначально был пустой, но в дальнейшем запарасили в него данный с локалсторэджа
const headTable = document.querySelector('#headTable')
//делаем хранение данных в локалсторэдж
const toStorage = () => {
    localStorage.setItem('freeOrders', JSON.stringify(orders))
}
const declOfNum = (number, titles) => { //функция склонения числительных
    return number + ' ' + titles[(number % 100 > 4 && number % 100 < 20) ? 2 : [2 ,0, 1, 1, 1, 2] [(number % 10 < 5) ? number % 10 : 5]]
}
const calcDeadline = (deadline) => {
    let dateStop = new Date(deadline)
    let dateNow = new Date()
    let timeRemaining = (dateStop - dateNow) / 1000
    let days = Math.floor(timeRemaining / 60 / 60 )
    if(days / 24 > 2){
        return declOfNum(days, ['день', 'дня', 'дней'])
    }
    return declOfNum(days, ['час', 'часа', 'часов']);
}
const handlerModal = (e) => { //функция для закрытия модалок и активации кнопок внутри
    const target = e.target
    const modal = target.closest('.order-modal')//получаем сами модалки
    //нужно получить order по id(numberOrder) модалки, который присвоили в функции openModal
    const order = orders[modal.numberOrder] //заказ будет равен заказу из массива под определенным номером, модальное окно которого вызвали

    const baseAction = () => {//для устранения дубюлирования кода
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
    const modal = active ? modalOrderActive : modalOrder//получаем модальное окно в зависимости от условий, если order.active тру, то отроется модалка с активным классом
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
const sortOrder = (arr, property) => { //функция для сортировки, передаем массив, который сортируем и свойства
    arr.sort((a, b) => a[property] > b[property] ? 1 : -1) //метод сорт сортирует, принимает 2 элемента а и б и сравнивает свойства элемента а и элемента б? смысл такой что а и б это объекты( наши заказы ) и тот, который из них больше возвращает единицу, а если нет, то -1
}
//делаем сортировку, добавили в шапку таблицы id и классы через делигирование
headTable.addEventListener('click', (e) => {
    const target = e.target
    if(target.closest('.head-sort')) {
        if(target.id === 'taskSort') {
            debugger
            sortOrder(orders, 'title') //передаем массив и сортируемое свойство
        }
        if(target.id === 'currencySort') {
            sortOrder(orders, 'currency') //передаем массив и сортируемое свойство
        }
        if(target.id === 'deadlineSort') {
            sortOrder(orders, 'deadline') //передаем массив и сортируемое свойство
        }
        toStorage()//после сортировки надо занести данные в локал сторедж
        renderOrders()//и сделать рендер
    }
})

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
        const currentDate = new Date().toISOString().substring(0, 10)//получение текущей даты в нужном формате
        document.querySelector('#deadline').min = currentDate; //ограничение дат в календаре, чтобы не ставить даты прошедшего времени
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
    //console.log(orders);
    formCustomer.reset()
    toStorage()
    //e.target.reset()
})

//открытие нужных разделов страницы по клику
//открытие модальных окон и закрытие модальный окон
//добавление контента в формы модального окна включая имейл и картинку
//формирование массива с объектами с карточками заказа
//рендер карточек в общую таблицу
//запуск обратного таймера до дедлайна
//сортировка таблицы

