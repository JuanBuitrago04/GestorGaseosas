document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('gaseosaForm');
    const gaseosasList = document.getElementById('gaseosasItems');
    const API_URL = 'http://localhost:3000'; // Ensure this matches your backend server address and port
    const saborSelect = document.getElementById('sabor');
    const cantidadInput = document.getElementById('cantidad');
    const valorTotalInput = document.getElementById('valorTotal');
    const sizeSelect = document.getElementById('size');

    // Variables para el modal de edicion
    const editModal = document.getElementById('editModal');
    const editSabor = document.getElementById('editSabor');
    const editCantidad = document.getElementById('editCantidad');
    const editValorTotal = document.getElementById('editValorTotal');
    const editEstado = document.getElementById('editEstado');
    const editModoPago = document.getElementById('editModoPago');
    const editSize = document.getElementById('editSize');
    const saveEditButton = document.getElementById('saveEdit');
    const cancelEditButton = document.getElementById('cancelEdit');
    let gaseosaIdToEdit = null;

    // Variables para el modal de confirmacion de eliminacion
    const deleteModal = document.getElementById('deleteModal');
    const confirmDeleteButton = document.getElementById('confirmDelete');
    const cancelDeleteButton = document.getElementById('cancelDelete');
    let gaseosaIdToDelete = null;

    fetchGaseosas();

    saborSelect.addEventListener('change', actualizarValorTotal);
    sizeSelect.addEventListener('change', actualizarValorTotal);
    cantidadInput.addEventListener('input', actualizarValorTotal);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const gaseosaData = Object.fromEntries(formData.entries());
        gaseosaData.size = sizeSelect.value; // Ensure size is included

        console.log('Sending data:', gaseosaData); // Log data being sent for debugging

        // Agregar la fecha actual al objeto gaseosaData
        gaseosaData.fechaVenta = new Date().toISOString().split('T')[0];

        try {
            const response = await fetch(`${API_URL}/registro`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(gaseosaData),
            });

            if (response.ok) {
                form.reset();
                fetchGaseosas();
            } else {
                const errorData = await response.json();
                console.error('Error response:', errorData); // Log error response
            }
        } catch (error) {
            console.error('Error al registrar gaseosa:', error);
        }
    });

    

    
    async function fetchGaseosas() {
        try {
            const response = await fetch(`${API_URL}/consultar`);
            const gaseosas = await response.json();
            console.log('Gaseosas:', gaseosas);
            renderGaseosas(gaseosas);
        } catch (error) {
            console.error('Error al obtener gaseosas:', error);
        }
    }

    function formatFecha(fechaISO) {
        const fecha = new Date(fechaISO);
        return fecha.toLocaleDateString('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' });
    }

    function formatPrecio(valor) {
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(valor);
    }

    function mostrarEliminarConfirmacion() {
        gaseosaIdToDelete = id;
        deleteModal.classList.remove('hidden');
    }
    
    function renderGaseosas(gaseosas) {
        gaseosasList.innerHTML = '';
        gaseosas.forEach(gaseosa => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatFecha(gaseosa.fechaVenta)}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${gaseosa.sabor}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${gaseosa.cantidad}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${gaseosa.estado}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatPrecio(gaseosa.valorTotal)}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${gaseosa.modoPago}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${gaseosa.size}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button class="edit-button text-indigo-600 hover:text-indigo-900"
                     data-id="${gaseosa.id}" data-sabor="${gaseosa.sabor}" 
                     data-cantidad="${gaseosa.cantidad}" data-estado="${gaseosa.estado}" 
                     data-modoPago="${gaseosa.modoPago}" data-size="${gaseosa.size}" 
                     data-valorTotal="${gaseosa.valorTotal}">Editar</button>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button class="delete-button text-red-600 hover:text-green-900" onclick="mostrarEliminarConfirmacion()">Eliminar</button>
                </td>
            `;
            gaseosasList.appendChild(tr);
        });
    
        // Add event listeners for edit and delete buttons
        const editButtons = document.querySelectorAll(".edit-button");
        const deleteButtons = document.querySelectorAll(".delete-button");
    
        if (editButtons) {
            editButtons.forEach(button => {
                button.addEventListener("click", openEditModal);
            });
        }
    
        if (deleteButtons) {
            deleteButtons.forEach(button => {
                button.addEventListener("click", openDeleteModal);
            });
        }
    }

    function actualizarValorTotal() {
        const selectedSabor = saborSelect.value;
        const selectedSize = sizeSelect.value;
        const cantidad = parseInt(cantidadInput.value);
        let precioUnidad = 0;

        if (selectedSabor && selectedSize) {
            if (selectedSabor === 'Colombiana') {
                if (selectedSize === 'mega') {
                    precioUnidad = 8000;
                } else if (selectedSize === '1.5L') {
                    precioUnidad = 5000;
                }
            } else if (selectedSabor === 'Coca Cola') {
                if (selectedSize === 'mega') {
                    precioUnidad = 9500;
                } else if (selectedSize === '1.5L') {
                    precioUnidad = 6500;
                }
            } else if (selectedSabor === 'Cuatro') {
                if (selectedSize === 'mega') {
                    precioUnidad = 9500;
                } else if (selectedSize === '1.5L') {
                    precioUnidad = 6000;
                }
            } else if (selectedSabor === 'Ginger') {
                if (selectedSize === '1.5L') {
                    precioUnidad = 6500;
                }
            } else if (selectedSabor === 'Bretana') {
                if (selectedSize === '1.5L') {
                    precioUnidad = 4500;
                }
            } else if (selectedSabor === 'Manzana Mega') {
                if (selectedSize === 'mega') {
                    precioUnidad = 8000;
                }
            }
        }

        if (!isNaN(precioUnidad) && !isNaN(cantidad)) {
            valorTotalInput.value = precioUnidad * cantidad;
        }
    }

    function openEditModal(event) {
        const button = event.currentTarget;
        gaseosaIdToEdit = button.getAttribute('data-id');
        editSabor.value = button.getAttribute('data-sabor');
        editCantidad.value = button.getAttribute('data-cantidad');
        editEstado.value = button.getAttribute('data-estado');
        editModoPago.value = button.getAttribute('data-modoPago');
        editSize.value = button.getAttribute('data-size');
        editValorTotal.value = button.getAttribute('data-valorTotal');
        editModal.classList.remove('hidden');
    }

    saveEditButton.addEventListener('click', async () => {
        if (gaseosaIdToEdit) {
            const updatedGaseosa = {
                sabor: editSabor.value,
                cantidad: editCantidad.value,
                estado: editEstado.value,
                modoPago: editModoPago.value,
                size: editSize.value,
                valorTotal: editValorTotal.value
            };

            try {
                const response = await fetch(`${API_URL}/actualizar/${gaseosaIdToEdit}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedGaseosa)
                });

                if (response.ok) {
                    fetchGaseosas();
                    editModal.classList.add('hidden');
                    gaseosaIdToEdit = null;
                }
            } catch (error) {
                console.error('Error al actualizar gaseosa:', error);
            }
        }
    });

    cancelEditButton.addEventListener('click', () => {
        editModal.classList.add('hidden');
        gaseosaIdToEdit = null;
    });

    confirmDeleteButton.addEventListener('click', async () => {
        if (gaseosaIdToDelete) {
            try {
                const response = await fetch(`${API_URL}/eliminar/${gaseosaIdToDelete}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    fetchGaseosas();
                    deleteModal.classList.add('hidden');
                    gaseosaIdToDelete = null;
                }
            } catch (error) {
                console.error('Error al eliminar gaseosa:', error);
            }
        }
    });

    cancelDeleteButton.addEventListener('click', () => {
        deleteModal.classList.add('hidden');
        gaseosaIdToDelete = null;
    });

    
    actualizarValorTotal();

    // Add event listeners for cancel buttons after DOM is fully loaded
    document.getElementById("cancelEdit")?.addEventListener("click", () => {
        editModal.classList.add("hidden");
    });


    document.getElementById("cancelDelete")?.addEventListener("click", () => {
        console.log('hola')
        deleteModal.classList.add("hidden");
    });
});