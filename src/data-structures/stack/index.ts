import type { List } from '../linked-list';
import LinkedListNode from '../linked-list/node';

class Stack<T> {
	constructor(private list: List<T> = null) {}

	/**
	 * return size of the stacks - O(1)
	 * @returns {number}
	 */
	size() {
		return this.list.size;
	}

	/**
	 * return stack is empty or not - O(1)
	 * @returns {boolean}
	 */
	isEmpty(): boolean {
		return !this.list;
	}

	/**
	 * Delete all elements of the stack - O(1)
	 */
	clear() {
		this.list = null;
	}

	/****************************************************************
                            INSERTION/DELETION
    ***************************************************************** */

	/**
	 * Pushes element onto the stack - O(1)
	 * @param {T} element - element to push on stack
	 */
	push(val: T): void {
		if (this.isEmpty()) {
			this.initList(val);
			return;
		}
		const newNode = new LinkedListNode<T>(val);
		newNode.prev = this.list.tail;
		this.list.tail.next = newNode;
		this.list.tail = newNode;
		this.list.size++;
	}

	/**
	 * Initialize the list stack when stack is empty
	 * @param {T} val
	 */
	initList(val: T) {
		const newNode = new LinkedListNode<T>(val);
		this.list = {
			head: newNode,
			tail: newNode,
			size: 1
		};
	}

	/**
	 * Return the element remove out of stack - O(1)
	 * @returns {T}
	 */
	pop(): T {
		if (this.isEmpty()) return;
		const val = this.list.tail.val;
		this.list.tail = this.list.tail.prev;
		this.list.tail.next = null;
		this.list.size--;
		return val;
	}

	/**
	 * Peeks at the top  of the stack - O(1)
	 * @returns {T}
	 */
	peek(): T {
		if (this.isEmpty) return;
		return this.list.tail.val;
	}

	/**
	 * Checking if val has exist on the stack - O(n)
	 * @param {T} val
	 * @returns {boolean}
	 */
	contains(val: T): boolean {
		if (this.isEmpty()) return false;
		for (let curNode = this.list.head; curNode; curNode = curNode.next) {
			if (curNode.val === val) return true;
		}
		return false;
	}

	show(): Stack<T>[] {
		if (!this.list) return;
		const stack = [];
		for (let curNode = this.list.head; curNode !== null; curNode = curNode.next) {
			stack.push(curNode);
		}
		return stack;
	}
}

export default Stack;
