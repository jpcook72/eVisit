1. How does your code work?

	It uses two main data structures-- a hash table to store IP addresses, and an array to hold the top 100.
	
	When an IP address is taken in, it is stored in the hashtable by IP address keys (i.e. 255.0.0.0 is a 4-key nested object).
	This approach saves (a bit) of space with repeated prefixes (see Question #4, part A for more discussion on this).

	The hashtable object stores the # of hits an IP address has had, so this number increments on each call of the requestHandled function.

	At this point, my code checks to see if an IP address should be in the top 100 based off of the # of hits it has now.
	If it should be in the top 100, it will swap it with the highest-ranked IP address that it was previously tied with.

	This way, the top 100 is always ranked and in order, and can be called with the getTop100 method in O(1) time.

	Notes: 
		-if 3 IP addresses are tied in 99th, the top 100 will only contain 2 of them.
		-the top 100 will contain "nulls" if less than 100 unique IPs have been handled.
		-tie order is random (not actually, but essentially).

	EXAMPLE:
			Say ip123 is tied in 99th place with 5 other IP addresses. They all have 5 hits currently. Say ip123 is not in the top 100.
			When ip123 gets a hit, first we will look it up in our tracker, and increment the # of hits to 6.
			Then, we will see that it should be moved up in rankings, and we will swap it with the highest element it was previously tied with,
			which in this case is the object ranked at 99. At that point, ip123 will swap with obj#99, and obj#99 will be taken 
			out of the top 100.

2. What is the runtime complexity of each function?

	Everything is O(1). The absolute worst-case involves the requestHandled function iterating
	through the whole top 100 array. This would be rare, and still constant.

3. What would you do differently if you had more time?

	- Account for ties, particularly in the bottom of top 100!
		I set up the function to return exactly 100 IP addresses,
		so if there is a 3-way tie between the elements in 99th place,
		my function will randomly (not technically random, but for all intents and purposes)
		return 2 of them. If I had more time, I would look into doing something like ranking 
		the ties alphabetically, or putting a little bit more reason into the way I handled ties.
		Since it wasn't trivial to do, and I don't think this was necessarily what you guys wanted to
		test with this problem, I ignored it.

	- Look more into JS maps (see question #4, other options #2) to see if storing IPs
	as a number in a map instead of a string in an object could have made a significant enough
	space difference to warrant using.


4. What other approaches did you decide not to pursue?

	*****
	* A. The main thing I went back and forth on was how I stored the IP addresses.
	*****
		Time complexity on these approaches is the same, but the other ones use/could possibly use slightly
		less space.
		***
		* What I did: Store in a hashtable (JS object) by the four sections of the IP address.
		***
			I.e. Inserting 255.0.1.2 and 255.0.0.1 = 
						{ 
							255 : { 
								0 : {
									0: {
										1: {}
									},
									1: {
										2: {}
									}
								}
							}
						}
		***
		* Other option 1: Store in a hashtable (JS object) by each individual character
		***
			I.e. Inserting 255.0.1.2 and 255.0.0.1 = 
						{ 
							2 : { 
								5 : {
									5: {
										.: {
											0: {
												.: {
													1: {
														.: {
															2: {}
														}
													},
													0: {
														.: {
															1: {}
														}
													}
												}
											}
										}
									}
								}
							}
						}
			Why I didn't do this option:
				Because it is so tedious! This would technically save a little bit more space
				than the approach I used, but I felt like my code would be less clear, 
				and it just felt like the trade-off wasn't worth it for the exercise. 
				If we REALLY needed every single bit we could possibly get, this option is better.
		***	
		* Other option 2: Store IP address as 32-bit number in a JS map object, which allows us to store the key by number, not string.
		***
			i.e. IP Address that represents 146273 & IP Address that represents 1747292 = {
				146273: {},
				1747292: {}
			}
			I know every IP address is just a 32 bit number, broken into 4 8-bit numbers.
			Because JS can't use numbers as object keys, I didn't use this fact at all in my approach.
			HOWEVER, JS maps CAN use numbers as keys. I dug into this a little bit to try to figure out
			exactly how much space it would take up to just store each IP address in a map under its number key.
			I found on the internet that storing a number takes 8 bytes in javascript. Storing a character takes 1.

			Therefore, storing full IP addresses as strings in a hashtable would be worse--
				255.255.255.255 = ~14 bytes vs 255.255.255.255 in 32-bit form = ~8 bytes.
			
			But once I implement my method, where we re-use duplicate prefixes, my approach will probably be better 
			in the order of 10 millions.
				For example,
					There are only 256 * 256 = 65536 possible 2-key prefixes.
					So, with n in the 10 millions, we are probably need 65526 + 6 * n bytes, vs 8 * n bytes in approach #2.

			This approach would probably be better if the magnitude of the problem is smaller, and we are storing tens of thousands
			of IP addresses instead of 10s of millions, for example.

			A few other things that pushed me away from this to my approach:
				1. This just didn't feel like a realistic way this would be solved. I know in the real world, 
					we probably wouldn't store 10s of millions of IP addresses in memory, and instead they would probably
					be stored in caches or databases using some kind of sharding technique. I liked that the approach I settled
					on resembled that a little bit more.
				2. This felt like a javascript-specific distinction, so maybe less important for the sake of the exercise. 
					I don't know if other languages have the same types of data structure difference in the variable types they can use as keys.
				3. I don't use maps a ton (or think about exactly how many bytes I'm using in javascript),
					so it is very possible that some of my info on the exact space usage is off. I could also just
					be unaware of some reason the space a map takes up is way better or worse.

	*****
	* B. An easy but important decision was whether the Top 100 should be a pre-sorted array, or sorted at runtime.
	*****
		...And I realized pretty quickly that the nlogn sort every time getTop100 was called would be pretty awful for a quick dashboard response.
		The trade-off is that requestHandled got a tad slower, since it has to move IP addresses to their proper rank in the top 100.
		But, requestHandled is still technically constant time (worst case is the top 100 objects are all tied, and requestHandled has to iterate through 100 objects).
		So this was a no-brainer trade-off.

5. How would you test this?

	First things first is unit tests of each class method.
	Besides that, the hard part would be testing that our system can handle all of the requests. 

	I have never done load testing, but I believe load testing is something that can be used for this.
	Something to keep in mind with the load testing is that the rest of our architecture is probably not simplistic if
	we are getting 10s of millions of request a day. There is probably a load balancer, multiple servers, etc. These things definitely
	need to be taken into account, but, again, I have never done load testing so can't offer many more specifics.