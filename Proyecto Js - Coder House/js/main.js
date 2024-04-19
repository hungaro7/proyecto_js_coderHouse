document.addEventListener('DOMContentLoaded', async function() {
	
	console.log("Init")
	
	const userSelect            			=   document.getElementById('user-select')
	const movementSection       			=   document.getElementById('movement-section')
	const totalMovementsDisplay				= document.getElementById('total-movements')

	let totalMovements						=	0
	let usuarios							=	[]

	function updateTotal() {

		totalMovementsDisplay.textContent	=	totalMovements.toFixed(2)
	
	}

	async function obtenerUsuarios() {
		
		try {
			
			const response					=	await fetch('https://jsonplaceholder.typicode.com/users')
			
			if(!response.ok) {

				throw new Error('Ocurrió un error al obtener los usuarios.')

			}

			usuarios						=	await response.json()

			usuarios.forEach(usuario => {
				const option				=	document.createElement('option')
				option.value				=	usuario.id
				option.textContent			=	usuario.name
				userSelect.appendChild(option)
			})

			return usuarios

		} catch(error) {

			console.error('Error:', error.message)
			
			return [] // Devuelve una matriz vacía en caso de error

		}

	}
	
	function deleteMovement(event) {
		
		const movementItem					=	event.target.closest('li')
		
		if(!movementItem) return

		const movementType					=	movementItem.dataset.type
		const movementAmount				=	parseFloat(movementItem.dataset.amount)

		if(movementType === 'ingreso') {

			totalMovements					-=	movementAmount

		} else {

			totalMovements					+=	movementAmount

		}

		movementItem.remove()

		updateTotal()

	}

	async function cargarGastos(usuario) {
		
		try {

			// Simulación de carga de gastos (aquí realizarías la solicitud al servidor)
			console.log(`Cargando gastos para el usuario: ${usuario.name}`)
	
			// Supongamos que obtienes los gastos del usuario desde una API
			const response					=	await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${usuario.id}`)
			const gastos					=	await response.json()

			console.log("Gastos", gastos)
	
			// Obtener la lista de movimientos
			const movementList				=	document.getElementById('movements')
	
			// Mostrar los gastos en la interfaz de usuario
			gastos.forEach(gasto => {

				const movementItem			=	document.createElement('li')
				movementItem.textContent	=	`Gasto: ${gasto.id}`
				movementList.appendChild(movementItem)
	
				// Sumar el gasto al total de movimientos
				totalMovements				+=	parseFloat(gasto.id)

				updateTotal()

			})

		} catch (error) {

			console.error('Error al cargar los gastos:', error.message)

		}

	}

	userSelect.addEventListener('change', async function() {
	
		const userId						=	parseInt(userSelect.value)
		
		if(isNaN(userId)) return

		// Ocultar la sección de movimientos mientras se cargan los datos
		// movementSection.style.display = 'none'

		const selectedUser					=	usuarios.find(usuario => usuario.id === userId)
		
		if(selectedUser) {

			console.log('Usuario seleccionado:', selectedUser)
			
			// Establecer los gastos en cero al seleccionar un usuario
			totalMovements					=	0
			
			updateTotal()
			
			// Mostrar la sección de movimientos antes de cargar los datos
			movementSection.style.display	=	'block'
			// Cargar los gastos del usuario seleccionado

			// await cargarGastos(selectedUser)

		} else {

			console.error('Usuario no encontrado')

		}

	})

	// Obtener los usuarios al cargar la página
	await obtenerUsuarios()

})