// TODO this is a mess, reworking needed
const initialState =	{
							headerIsShown: true,
							sidebarIsOpen: false,
							controlsAreShown: false,
							error: '', // never used atm
                            loading: true, // change to null?
                        }

export default (state = initialState, { type, payload }) => {
	let newState = state
	
	switch(type) {
		case 'TOGGLE_HEADER':
			return 	Object.assign({},
						state,
						{ headerIsShown: payload }
					)
		case 'TOGGLE_SIDEBAR':
			return 	Object.assign({},
						state,
						{ sidebarIsOpen: payload }
					)
		case 'TOGGLE_CONTROLS':
			return 	Object.assign({},
						state,
						{ controlsAreShown: payload }
					)
	}

	return newState
}