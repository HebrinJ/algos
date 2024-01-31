
export class Node<T> {
    value: T;
    next: Node<T> | null;
    constructor(value: T, next?: Node<T> | null) {
      this.value = value;
      this.next = next === undefined ? null : next;
    }
}
  
interface ILinkedList<T> {
    addToHead: (element: T) => void;
    addToTail: (element: T) => void;
    removeFromHead: () => void;
    removeFromTail: () => void;
    insertAt: (node: T, position: number) => void;
    removeAt: (position: number) => void;

    getHead: () => Node<T> | null;

    //getSize: () => number;
    print: () => void;
}
  
export class LinkedList<T> implements ILinkedList<T> {
    private head: Node<T> | null;
    private size: number;

    constructor(list: T[]) {
      this.head = null;
      this.size = 0;

      for (let i = 0; i < list.length; i++) {
        this.addToTail(list[i]);        
      }
    }

    getHead() {
      return this.head;
    }

    addToHead(element: T) {
      const node = new Node(element);

      if (this.head === null) {
        this.head = node;
      } else {
        node.next = this.head;
        this.head = node;
      }

      this.size++;
    }

    addToTail(element: T) {
      const node = new Node(element);
      let current;
      
      if (this.head === null) {
        this.head = node;
      } else {
        current = this.head;
        while (current.next) {
          current = current.next;
        }
  
        current.next = node;
      }

      this.size++;
    }

    removeFromHead() {
      if(this.head?.next) {
        this.head = this.head?.next;
      } else {
        this.head = null;
      }

      this.size--;
    }

    removeFromTail() {
      let current = null;
      let prev = null;
      
      if(this.head !== null) {
        current = this.head;

        while(current.next) {
          prev = current;
          current = current.next;
        }
        
        prev!.next = null;
      }
      
      this.size--;
    }
  
    insertAt(element: T, index: number) {
      if (index < 0 || index > this.size) {
        console.log('Enter a valid index');
        return;
      } else {
        const node = new Node(element);
  
        // добавить элемент в начало списка
        if (index === 0) {
          node.next = this.head;
          this.head = node;
        } else {
          let curr = this.head;        
          let currIndex = 0;
          let prev = null;
  
          // перебрать элементы в списке до нужной позиции        
          while (currIndex < index) {   
            prev = curr;
            curr = curr!.next;
            currIndex++;
          }
          // добавляем элемент
          prev!.next = node;
          node.next = curr;        
          curr = node;
        }
  
        this.size++;
      }
    }

    removeAt(index: number) {
      console.log('remove')
      if (index < 0 || index > this.size) {
        console.log('Enter a valid index');
        return;
      } else {        
        if (index === 0) {
          if(this.head) this.head = this.head?.next;
        } else {
          let curr = this.head;        
          let currIndex = 0;
          let prev = null;
  
          // перебрать элементы в списке до нужной позиции        
          while (currIndex < index) {   
            prev = curr;
            curr = curr!.next;
            currIndex++;
          }

          if(prev?.next && curr?.next) {
            prev.next = curr?.next;
          }
        }
  
        this.size--;
      }
    }
  
    
  
    getSize() {
      return this.size;
    }
  
    print() {
      let curr = this.head;
      let res = '';
      while (curr) {
        res += `${curr.value} `;
        curr = curr.next;
      }
      console.log(res);
    }
  }


// const removeElements = (head: Node<number> | null, val: number): Node<number> | null => {
//     let dummyHead = new Node(0); // добавим в начало пустой узел
//     dummyHead.next = head;
//     let curr = dummyHead;
    
//     while(curr.next) {
  
//         if(curr.next.value === val) {  // Есть совпадение значения
//           curr.next = curr.next.next;
//           continue;
//         }
      
//       curr = curr.next;
//     }