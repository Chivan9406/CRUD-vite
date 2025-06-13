import modalHTML from './render-modal.html?raw'
import './render-modal.css'
import { getUserById } from '../../use-cases/get-user-by-id'

let modal
let form
let loadedUser = {}

export const showModal = async (id) => {
  modal?.classList.remove('hide-modal')
  loadedUser = {}
  if (!id) return
  const user = await getUserById(id)
  setFormValues(user)
}

export const hideModal = () => {
  modal?.classList.add('hide-modal')
  form?.reset()
}

const setFormValues = (user) => {
  form.querySelector('[name="firstName"]').value = user.firstName
  form.querySelector('[name="lastName"]').value = user.lastName
  form.querySelector('[name="balance"]').value = user.balance
  form.querySelector('[name="isActive"]').checked = user.isActive
  loadedUser = user
}

export const renderModal = (element, callback) => {
  if (modal) return

  modal = document.createElement('div')
  modal.innerHTML = modalHTML
  modal.classList.add('modal-container', 'hide-modal')
  form = modal.querySelector('form')
  let clickedOverlay = false

  modal.addEventListener('mousedown', (event) => {
    clickedOverlay = (event.target === event.currentTarget)
  })

  modal.addEventListener('click', (event) => {
    if (clickedOverlay && event.target === event.currentTarget) {
      hideModal()
    }

    clickedOverlay = false
  })

  form.addEventListener('submit', async (event) => {
    event.preventDefault()

    const formData = new FormData(form)
    const userLike = {...loadedUser}

    for (const [key, value] of formData) {
      if (key === 'balance') {
        userLike.balance = +value
      } else if (key === 'isActive') {
        userLike.isActive = form.elements['isActive'].checked
      } else {
        userLike[key] = value
      }
    }

    if (!formData.has('isActive')) {
      userLike.isActive = false
    }

    await callback(userLike)
    hideModal()
  })

  element.append(modal)
}