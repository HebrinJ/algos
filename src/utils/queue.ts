interface IQueue<T> {
    enqueue: (item: T) => void;
    dequeue: () => void;
  }
  
  export class Queue<T> implements IQueue<T> {
    private container: (T | null)[] = [];
    private head = 0;
    private tail = 0;
    private readonly size: number = 0;
    private length: number = 0;
  
    constructor(size: number) {
      this.size = size;
      this.container = Array(size);
      this.fillQueueWithNull();
    }

    fillQueueWithNull = () => {
        for (let i = 0; i < this.container.length; i++) {
            this.container[i] = null;
        }
    }

    getAllQueue = (): (T | null)[] => {
        return this.container;
    }

    getHead = () => {
        return this.head;
    }

    getTail = () => {
        return this.tail;
    }
  
    enqueue = (item: T) => {
      if (this.length >= this.size) {
        return;
      }
  
      this.container[this.tail] = item;
      this.tail++;
      this.length++;
      
      if (this.tail >= this.size) {
        this.tail = 0;
      }
      
    };
  
    dequeue = () => {
      if (this.isEmpty()) {
        return;
      }
  
      this.container[this.head] = null;
      this.head++;
      this.length--;
      
      if (this.head >= this.size) {
        this.head = 0;
      }
      
    };
  
    isEmpty = () => this.length === 0;
  }