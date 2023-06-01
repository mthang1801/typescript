class LinkedListNode<T> {
	public val: T;
	public next: LinkedListNode<T>;
	public prev: LinkedListNode<T>;
	constructor(val: T) {
		this.val = val;
		this.next = null;
		this.prev = null;
	}
}

export default LinkedListNode;
