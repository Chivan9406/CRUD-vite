import './render-table.css'
import usersStore from '../../store/users-store'
import { showModal } from '../render-modal/render-modal'
import { deleteUserById } from '../../use-cases/delete-user-by-id'

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

const tableSelectListener = async (event) => {
  const element = event.target.closest('.select-user')
  if (!element) return
  const id = element.getAttribute('data-id')
  await showModal(id)
}

const tableDeleteListener = async (event) => {
  const element = event.target.closest('.delete-user')
  if (!element) return
  const id = element.getAttribute('data-id')

  try {
    await deleteUserById(id)
    await usersStore.reloadPage()
    document.querySelector('#current-page').innerText = usersStore.getCurrentPage()
    renderTable()
  } catch (e) {
    console.error(e)
    alert('No se pudo eliminar el usuario')
  }
}

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
        <td>${isActive ? 'Yes' : 'No'}</td>
        <td>
          <a href="#" class="select-user" data-id="${id}">Select</a>
          |
          <a href="#" class="delete-user" data-id="${id}">Delete</a>
        </td>
      </tr>
    `
  })

  table.querySelector('tbody').innerHTML = tableHTML
}