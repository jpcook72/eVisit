
class IPAddressTracker {
	constructor() {
		this.tracker = {}
		this.top100 = new Array(100).fill(null)
	}
	getTop100() {
		// this method has O(1) time complexity -- note, this will NOT return more than 100 ip addresses.
		// i.e. if 3 IP addresses tied in 99th, it will only return 2 of them.
		// it will also return "null" if less than 100 unique IPs have been handled.
		return this.top100
	}
	clear() {
		// this method has O(1) time complexity. It will always create a 100 element array.
		this.tracker = {}
		this.top100 = new Array(100).fill(null)
	}
	requestHandled(IPAddress) {
		// this method has O(1) time complexity -- it adds IP addresses to the tracker object, and updates ranks in the top 100 (if applicable)

		// this method gets the 4 IP keys. I.e. getIPKeys(256.0.0.0) -> ["256","0","0","0"]
		const IPKeys = this.getIPKeys(IPAddress)

		// this sets key0-3 as the 4 portions of the IP address
		// i.e. If IPAddress = 255.1.2.3, key0 = "255", key1 = "1", etc.
		const { 0: key0, 1: key1, 2: key2, 3: key3} = IPKeys

		// this is just to create the nested objects if they don't exist yet
		if (!(this.tracker[key0]))                   this.tracker[key0] = {}
		if (!(this.tracker[key0][key1]))             this.tracker[key0][key1] = {}
		if (!(this.tracker[key0][key1][key2]))       this.tracker[key0][key1][key2] = {}
		if (!(this.tracker[key0][key1][key2][key3])) this.tracker[key0][key1][key2][key3] = { hits: 0 }

		// increment the number of hits on an IP address
		const IPAddressObject = this.tracker[key0][key1][key2][key3]
		IPAddressObject.hits++

		// check for rank update
		this.checkForRankUpdate(IPAddress, IPAddressObject)
	}	
	getIPKeys(IPAddress) {
		// this method has O(1) time complexity (constant bc num chars in address is <= 15)
		// it returns a 4-element array with the 4 keys from an IP address
		// i.e. getIPKeys(256.0.0.0) -> ["256","0","0","0"]

		const IPKeys = []
		let currentKey = ""
		for (let i = 0; i < IPAddress.length; i++) {
			const currentCharacter = IPAddress[i]
			// when there is a ".", break off the currentKey and push it into final array. Then, reset currentKey.
			if (IPAddress[i] == ".") {
				IPKeys.push(currentKey)
				currentKey = ""
			// otherwise, add the currentCharacter to currentKey
			} else {
				currentKey += currentCharacter
			}
		}
		IPKeys.push(currentKey)

		return IPKeys
	}
	checkForRankUpdate(IPAddress, IPAddressObject) {
		// this method has O(1) time complexity -- it checks if an object's rankings are out of date, and calls a method to update them if so.

		const { hits } = IPAddressObject

		// if object is already ranked in top 100, or it should now be in top 100, then we will move it up in the rankings
		if ((IPAddressObject.rank !== undefined) || (hits >= this.top100[99].hits)) {

			// I don't store IPAddress or rank on an object unless they are in the top 100 (to save space). 
			// This adds them to the object if needed.
			IPAddressObject.IPAddress = IPAddress
			IPAddressObject.rank = IPAddress.rank !== undefined ? IPAddress.rank : null

			// Move up the rank of the object
			this.moveUpRank(IPAddress, IPAddressObject)
		}

	}
	moveUpRank(IPAddressObject) {
		//  this method has O(1) time complexity - its worst case is O(100), iterating over the top 100.

		//It swaps the object with the highest-ranking element it was tied with
		// i.e. if there was a 6-way tie for number of hits in 100th, and the current IP was not in the top 100, 
		// this will swap it with the 100th place element.
		// If 33, 34, and 35 all had the same number of hits, and this element was 35th, this will swap with 33 and 35.

		const { rank } = IPAddressObject

		// iterate through top 100 from either the current ranking (if currently ranked) or the object ranked #100 (if not currently ranked).
		// keep iterating until end (if current element has the most hits), 
		// or until the next element in iteration has more hits than current element.
		// edge case where there are still null elements in array, in which case we iterate to the lowest null index.
		let startIndex = rank === null ? 99 : rank
		let checkIndex = startIndex
		while ((checkIndex > 0) && ((this.top100[checkIndex - 1] == null) || (this.top100[startIndex].hits === this.top100[checkIndex - 1].hits))) {
			checkIndex--
		}

		let objectToSwapWith = this.top100[checkIndex]

		//handling case where top 100 still had null elements
		if (objectToSwapWith === null) objectToSwapWith = { rank : checkIndex, IPAddress: null }

		// swap current object with the object we found in while-loop.
		swap(objectToSwapWith, IPAddressObject)
	}
	swap(movingDown, movingUp) {
		// this method has O(1) time complexity - it swaps two elements in the array.
		// if the movingUp element was not in the array to start with, the movingDown element will end up outside of the array as well.
			
			//swap rank properties between the 2 objects
			const tempMinRank = movingUp.rank
			movingUp.rank = movingDown.rank
			movingDown.rank = tempMinRank

			// move movingUp element into new position
			this.top100[movingUp.rank] = movingUp

			// if movingDown is moving outside of top 100, delete properties to save space.
			// else, move to new spot
			if (movingDown.rank === null) {
				delete movingDown.IPAddress
				delete movingDown.rank
			} else {
				this.top100[movingDown.rank] = movingDown
			}

	}
}