'use strict'

const customer = document.querySelector('#customer')
const freelancer = document.querySelector('#freelancer')
const startBtnBlock = document.querySelector('.mt-5')

const blockCustomer = document.querySelector('#block-customer')
const blockFreelancer = document.querySelector('#block-freelancer')
const blockChoice = document.querySelector('#block-choice')
const btnExit = document.querySelector('#btn-exit')

const formCustomer = document.querySelector('#form-customer')

const orders = [] //массив для пуша созданных заказов

startBtnBlock.addEventListener('click', (e) => {
    console.log(e.target);
    if(e.target.closest('#customer')) {
        blockCustomer.style.display = 'block'
        blockChoice.style.display = 'none'
        btnExit.style.display = 'block'
    }
    if(e.target.closest('#freelancer')) {
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
    e.target.reset()
})
