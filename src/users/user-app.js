import usersStore from "./store/users-store.js";
import {renderTable} from "./presentation/render-table/render-table.js";
import {renderButtons} from "./presentation/render-buttons/render-buttons.js";
import {renderAddButton} from "./presentation/render-add-button/render-add-button.js";
import {renderModal} from "./presentation/render-modal/render-modal.js";
import {saveUser} from "./use-cases/save-user.js";

/**
 *
 * @param {HTMLDivElement} element
 */
export const UserApp = async (element) => {
    element.innerHTML = 'Loading...'
    await usersStore.loadNextPage()
    element.innerHTML = ''

    renderTable(element)
    renderButtons(element)
    renderAddButton(element)
    renderModal(element, async(userLike) => {
        const user = await saveUser(userLike)
        usersStore.onUserChanged(user)
        renderTable()
    })
}