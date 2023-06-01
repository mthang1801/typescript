import type { List } from './data-structures/linked-list';
import LinkedListNode from './data-structures/linked-list/node';

class LinkedList<T> {
	constructor(private list: List<T> = null) {}

	/**
	 * Return number of elements in the linked list - O(1)
	 * @returns {number}
	 */
	size(): number {
		return Number(this?.list?.size) || 0;
	}

	/**
	 * Checking if the list is empty - O(1)
	 * @returns {boolean}
	 */
	isEmpty(): boolean {
		return this.list === null;
	}

	/**
	 * Adding node into head of the linked list - O(1)
	 * @param {T} val
	 */
	addFront(val: T): void {
		if (this.isEmpty()) {
			this.initLinkedList(val);
			return;
		}
		const newNode = new LinkedListNode(val);
		newNode.next = this.list.head;
		this.list.head.prev = newNode;
		this.list.head = newNode;
		this.list.size++;
	}

	/**
	 * Initilized the linked list - O(1)
	 * @param val
	 */
	initLinkedList(val: T) {
		const newNode = new LinkedListNode<T>(val);
		this.list = {
			head: newNode,
			tail: newNode,
			size: 1
		};
	}

	/**
	 * Push a node into the linked list - O(1)
	 * @param val
	 */
	addBack(val: T): void {
		if (this.isEmpty()) {
			this.initLinkedList(val);
			return;
		}

		const newNode = new LinkedListNode<T>(val);
		newNode.prev = this.list.tail;
		this.list.tail.next = newNode;
		this.list.tail = newNode;
		this.list.size++;
	}

	/**
	 * Insert a node by index into the linked list - O(n)
	 * @param {T} val
	 * @param {number} pos
	 */
	insert(val: T, pos: number): void {
		if (pos === 0) this.addFront(val);
		if (pos === this.size()) this.addBack(val);
		if (pos < 0 || pos > this.size()) return;

		const newNode = new LinkedListNode<T>(val);        
        let curNode = this.get(pos);		
		newNode.next = curNode.next;
		newNode.prev = curNode;
		curNode.next = newNode;
		this.list.size++;
	}

	/**
	 * Get the first node value of the linked list - O(1)
	 * @return {T}
	 */
	peakFront(): T {
		if (this.isEmpty()) return null;
		return this.list.head.val;
	}

	/**
	 * Get the last node value of the linked list - O(1)
	 * @return {T}
	 */
	peakBack(): T {
		if (this.isEmpty()) return null;
		return this.list.tail.val;
	}

	/**
	 * Get node value by index - O(n)
	 * @param {number} pos
	 */
	get(pos: number): LinkedListNode<T> {
		if (this.isEmpty() || pos < 0 || pos > this.size()) return null;

		const middlePos = Math.floor(this.size() / 2);

		if (pos < middlePos) {
			let curNode = this.list.head;
			for (let i = 0; i < pos; i++) {
				curNode = curNode.next;
			}
			return curNode;
		}

		let curNode = this.list.tail;
		for (let i = this.size() - 1; i > pos; i--) {
			curNode = curNode.prev;
		}
		return curNode;
	}

	/**
	 * Find the position of node by value - O(n)
	 * @param {T} val
	 * @return {number}
	 */
	indexOf(val: T): number {
		if (this.isEmpty()) return -1;

		let curNode = this.list.head;
		for (let i = 0; i < this.size(); i++) {
			if (curNode.val === val) {
				return i;
			}
			curNode = curNode.next;
		}
		return -1;
	}

	/**
	 * check if linked list has contain input value - O(n)
	 * @param {T} val
	 * @return {boolean}
	 */
	includes(val: T): boolean {
		return this.indexOf(val) !== -1;
	}

	/**
	 * remove the first node in the linked list and return value of node - O(1)
	 * @return {T}
	 */
	removeFront(): T {
		if (this.isEmpty()) return;
		const value = this.list.head.val;
		this.list.head.next.prev = null;
		this.list.head = this.list.head.next;
		this.list.size--;
		return value;
	}

	/**
	 * remove the last node in the linked list and return value of node - O(1)
	 * @return {T}
	 */
	removeBack(): T {
		if (this.isEmpty()) return;
		const value = this.list.tail.val;
		this.list.tail.prev.next = null;
		this.list.tail = this.list.tail.prev;
		this.list.size--;
		return value;
	}

    /**
     * Remove all nodes which have value matching with input value - O(n)
     * @param {T} val 
     */
    remove(val: T ) : void { 
        if(this.isEmpty()) return ;              
        let curNode = this.list.head;
        for(let i = 0 ; i < this.size() ; i++)  {
            if(curNode.val === val){
                this.removeAt(i);
                i--;                
            }
            curNode = curNode.next;
        }
    }   

    /**
     * Remove node by index - O(n)
     * @param {number} pos 
     */
    removeAt(pos : number) : T {
        if(pos < 0 || pos > this.size() || this.isEmpty()) return;
        if(pos === 0) return this.removeFront();
        if(pos === this.size() - 1 ) return this.removeBack();

        let curNode = this.get(pos);
        curNode.prev.next = curNode.next;
        curNode.next.prev = curNode.prev; 
        return curNode.val;
    }

    concat(values : T[]) : LinkedList<T>[]  {
        values.forEach(value => this.addBack(value))
        return this.show()
    }

	show(): LinkedList<T>[] {
		if (!this.list) return;
		const stack = [];
		for (let curNode = this.list.head; curNode !== null; curNode = curNode.next) {
			stack.push(curNode);
		}
		return stack;
	}
}
export default LinkedList