import { Delta } from 'quill-next'
import { isEqual } from 'lodash-es'

function deltasAreEqual(delta1: Delta, delta2: Delta): boolean {
	return isEqual(delta1, delta2)
}

export { deltasAreEqual }
