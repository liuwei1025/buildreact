# buildreact

大家一起构建简单的 react

## 1. 从`jsx`到`object`

输入

```jsx
<div id="foo">
  <a>bar</a>
  <b />
</div>
```

输出

```json
{
  "type": "div",
  "props": {
    "id": "foo",
    "children": [
      {
        "type": "a",
        "props": {
          "children": [
            {
              "type": "TEXT_ELEMENT",
              "props": {
                "nodeValue": "bar",
                "children": []
              }
            }
          ]
        }
      },
      {
        "type": "b",
        "props": {
          "children": []
        }
      }
    ]
  }
}
```

## 2. 从`json`到`dom`（Render）

1. 从对象到 dom 的映射 函数形参确认`render(node, container)`
2. 递归子节点
3. 设置节点属性

```javascript
function render(element, container) {
  const dom =
    element.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(element.type)
​
  const isProperty = key => key !== "children"
  Object.keys(element.props)
    .filter(isProperty)
    .forEach(name => {
      dom[name] = element.props[name]
    })
​
  element.props.children.forEach(child =>
    render(child, dom)
  )
​
  container.appendChild(dom)
}
```

## 3. 并行模式（Concurrent mode）

> 递归无法中断，有可能**阻塞**主流程

1. 分片
   ```javascript
   let nextUnitOfWork = null
   ​
   function workLoop(deadline) {
     let shouldYield = false
     while (nextUnitOfWork && !shouldYield) {
       nextUnitOfWork = performUnitOfWork(
         nextUnitOfWork
       )
       shouldYield = deadline.timeRemaining() < 1
     }
     requestIdleCallback(workLoop)
   }
   ​
   requestIdleCallback(workLoop)
   ​
   function performUnitOfWork(nextUnitOfWork) {
     // TODO
   }
   ```

## 4. Fiber

![fiber长啥样](https://pomb.us/static/a88a3ec01855349c14302f6da28e2b0c/ac667/fiber1.png)

> object 转换为**fiber tree**

### Render 阶段 fiber node 要做的事儿

1. 将 node 节点转换为 element 增加到 dom
2. 将节点转换为 fiber node
3. 返回下一个 fiber node
