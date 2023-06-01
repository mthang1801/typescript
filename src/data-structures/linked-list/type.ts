import LinkedListNode from "./node";

export type List<T> = {
	head: LinkedListNode<T>;
	tail: LinkedListNode<T>;
	size: number;
};