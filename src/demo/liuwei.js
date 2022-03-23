function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child => {
        return typeof child === 'object' ? child : createTextElement(child);
      }),
    },
  };
}
function createTextElement(text) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      /**
       * 使用nodeValue是为了和dom的属性保持一致
       */
      nodeValue: text,
      /**
       * React doesn’t wrap primitive values or create empty arrays when there aren’t children,
       * but we do it because it will simplify our code,
       * and for our library we prefer simple code than performant code.
       */
      children: [],
    },
  };
}
function createDom(fiber) {
  const dom = fiber.type == 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(fiber.type);
  const isProperty = key => key !== 'children';
  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach(name => {
      dom[name] = fiber.props[name];
    });
  return dom;
}
function render(element, container) {
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [element],
    },
  };
}

let nextUnitOfWork = null;

window.requestIdleCallback = function (fn) {
  setTimeout(() => {
    fn({
      timeRemaining() {
        return 0;
      },
    });
  }, 100);
};

function workLoop(deadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }
  requestIdleCallback(workLoop);
}
requestIdleCallback(workLoop);

function performUnitOfWork(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
  if (fiber.parent) {
    fiber.parent.dom.appendChild(fiber.dom);
  }
  const elements = fiber.props.children;
  let index = 0;
  let prevSibling = null;
  while (index < elements.length) {
    const element = elements[index];
    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null,
    };
    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }
    prevSibling = newFiber;
    index++;
  }
  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
}
const Didact = {
  createElement,
  render,
};
/** @jsx Didact.createElement */
const element = (
  <div id="wmd-preview" class="wmd-preview" data-medium-element="true" style="height: auto;">
    <h1 data-anchor-id="nrlj" id="linux操作">
      linux操作
    </h1>
    <p data-anchor-id="thek">
      <code>系统</code>
    </p>
    <hr />
    <div class="md-section-divider"></div>
    <h2 data-anchor-id="x4dp" id="linux基本操作">
      <a href="http://blog.51cto.com/liguxk/152912" target="_blank">
        linux基本操作
      </a>
    </h2>
    <ul data-anchor-id="tw1a">
      <li>
        <code>sudo -i</code> 进入<code>root</code>用户
      </li>
      <li>
        <code>exit</code> 从root用户返回到之前的用户
      </li>
      <li>
        查看硬件信息 <code>df -h</code>
      </li>
      <li>
        <code>lsof -i tcp:3306</code>查看端口占用并返回pid，<code>list open file</code>的缩写
      </li>
      <li>
        <a href="https://www.tecmint.com/find-out-which-process-listening-on-a-particular-port/" target="_blank">
          查看占用端口的程序
        </a>
        <code>netstat -ltnp | grep -w ':80'</code>
      </li>
      <li>
        <a href="https://www.plesk.com/blog/various/find-files-in-linux-via-command-line/" target="_blank">
          查找文件
        </a>
        <code>find /home/ocean -name "index.html"</code>
      </li>
    </ul>
    <div class="md-section-divider"></div>
    <h3 data-anchor-id="cj8k" id="系统">
      系统
    </h3>
    <ul data-anchor-id="zc3h">
      <li>
        <code>uname -a</code> 查看内核/操作系统/CPU信息
      </li>
      <li>
        <code>cat /proc/cupinfo</code>查看CPU信息
      </li>
      <li>
        <code>env</code>查看环境变量
      </li>
      <li>
        <code>free -m</code>查看内存使用量和交换区使用量
      </li>
      <li>
        <code>df -h</code>查看各分区使用情况
      </li>
      <li>
        <code>head -n 1 /etc/issue</code> 查看操作系统版本
      </li>
      <li>
        <code>sudo -i</code>输入密码进入root
      </li>
      <li>
        <code>exit</code>退出root
      </li>
      <li>
        <code>ps -ef | grep node</code>
        <a href="https://linuxtools-rst.readthedocs.io/zh_CN/latest/tool/ps.html" target="_blank">
          ps
        </a>
      </li>
    </ul>
    <div class="md-section-divider"></div>
    <h3 data-anchor-id="rlak" id="网络">
      网络
    </h3>
    <p></p>
    <ul data-anchor-id="mjvh">
      <li>
        <code>netstat -an|grep 8088</code> 查看端口占用
      </li>
      <li>
        <code>lsof -i:8088</code> <br />
        <p></p>
        <blockquote class="white-blockquote">
          通过list open file命令可以查看到当前打开文件，在linux中所有事物都是以文件形式存在，包括网络连接及硬件设备
          <code>-i</code>参数表示网络链接，<code>:8088</code>指明端口号，该命令会同时列出<code>PID</code>，方便kill
        </blockquote>
      </li>
      <li>
        <code>sudo lsof -i -P | grep -i "listen"</code> 产看所有进程监听的端口
      </li>
      <li>
        <code>nc -zv 127.0.0.1 80</code> 查看IP和端口是否能连接上
      </li>
      <li>
        <code>arp -d -a</code>
        <a href="https://wangchujiang.com/linux-command/c/arp.html" target="_blank">
          删除网络缓存
        </a>
      </li>
    </ul>
    <div class="md-section-divider"></div>
    <h3 data-anchor-id="a7wn" id="title"></h3>
  </div>
);
console.log(element);
Didact.render(element, document.querySelector('#liuwei'));
