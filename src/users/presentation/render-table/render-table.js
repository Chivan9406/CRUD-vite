import './render-table.css'
import usersStore from "../../store/users-store";
import {showModal} from "../render-modal/render-modal.js";
import {deleteUserById} from "../../use-cases/delete-user-by-id.js";

let table

const createTable = () => {
    const table = document.createElement('table')
    const tableHeaders = document.createElement('thead')

    tableHeaders.innerHTML = `
        <tr>
            <th>#ID</th>
            <th>Balance</th>
            <th>FirstName</th>
            <th>LastName</th>
            <th>Active</th>
            <th>Actions</th>
        </tr>
    `

    const tableBody = document.createElement('tbody')

    table.append(tableHeaders, tableBody)
    return table
}

/**
 *
 * @param {MouseEvent} event
 */
const tableSelectListener = async (event) => {
    const element = event.target.closest('.select-user')

    if (!element) return

    const id = element.getAttribute('data-id')
    await showModal(id)
}

/**
 *
 * @param {MouseEvent} event
 */
const tableDeleteListener = async (event) => {
    const element = event.target.closest('.delete-user')

    if (!element) return

    const id = element.getAttribute('data-id')

    try {
        await deleteUserById(id)
        await usersStore.reloadPage()
        document.querySelector('#current-page').innerHTML = usersStore.getCurrentPage()
        renderTable()
    } catch (error) {
        console.error(error)
        alert('No se pudo eliminar')
    }
}

/**
 *
 * @param {HTMLDivElement} element
 */
export const renderTable = (element) => {
    const users = usersStore.getUsers()

    if (!table) {
        table = createTable()
        element.append(table)

        table.addEventListener('click', tableSelectListener)
        table.addEventListener('click', tableDeleteListener)
    }

    let tableHTML = ''

    users.forEach(({id, balance, firstName, lastName, isActive}) => {
        tableHTML += `
            <tr>
                <td>${id}</td>
                <td>${balance}</td>
                <td>${firstName}</td>
                <td>${lastName}</td>
                <td>${isActive}</td>
                <td>
                    <button class="select-user btn btn-blue" data-id="${id}">Select</button>
                    |
                    <button class="delete-user btn btn-red" data-id="${id}">Delete</button>
                </td>
            </tr>
        `
    })

    table.querySelector('tbody').innerHTML = tableHTML
}