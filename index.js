import { hash } from './utils.js'
// import Emitter from './emitter.js'
// const observer = new Emitter()
import Dep from './dep.js'



// function catchDeps(binding) {
//     if (binding.isFn) return
//     console.log('\n─ ' + binding.key)
//     var depsHash = hash()
//     observer.on('get', function (dep) {
//         if (depsHash[dep.key]) return
//         depsHash[dep.key] = 1
//         console.log('  └─ ' + dep.key)
//         binding.deps.push(dep)
//         dep.subs.push(binding)
//     })
//     // binding.value.$get()
//     observer.off('get')
// }

// function parse(bindings) {
//     console.log('\nparsing dependencies...')
//     observer.active = true
//     bindings.forEach(catchDeps)
//     observer.active = false
//     console.log('\ndone.')
// }
const getType = v => Object.prototype.toString.call(v).slice(8, -1);

function addGetterAndSetter(value) {
    if (!value) {
        return;
    }
    Object.keys(value).forEach((item) => {
        if (typeof value[item] === 'object') {
            addGetterAndSetter(value[item])
        } else {
            const dep = new Dep();
            let temp = value[item];
            Object.defineProperty(value, item, {
                get() {
                    // console.log('get', temp)
                    // 当 依赖函数执行的时候,就会获取值,会调用对应值的 get 函数,就收集依赖,下面的逻辑就会执行 
                    if (Dep.target) {
                        dep.depend();
                    }
                    return temp;
                },
                set(v) {
                    if (temp === v) { return }
                    // console.log('set', v)
                    temp = v;
                    dep.notify();
                    if (getType(temp) === 'Object') {
                        addGetterAndSetter(v)
                    }
                },
            });
        }
    });
    return value;
}


function Vue(obj) {
    let _data = (typeof obj.data === "function" ? obj.data() : obj.data) || {};
    // 复制属性
    for (let item in _data) {
        this[item] = _data[item]
    }
    // 设置为 响应式
    addGetterAndSetter(this)
    const computed = [];
    // 处理 computed
    for (let [k, v] of Object.entries(obj.computed)) {
        console.log(4, this, k, v,)
        // computed.push(v)
        Dep.target = {
            key: k, // k 是函数名称
            func: v.bind(this), // func 就是函数体
            instance: this  // 之所以传 instance 是为了在 computed 再次执行时,将结果更新到 vue 实例上去
        };
        const result = v.call(this);
        console.log(3333, result)
        this[k] = result;
        Dep.target = null;
    }
    // computed.length && parse(computed)
    // 添加响应式
}
// let object = new Vue({
//     data() {
//         return {
//             price: 5,
//             quantity: 2,
//             form: {
//                 name: "Bob",
//                 age: 12,
//             },
//         };
//     },
//     computed: {
//         getValue() {
//             // console.log("this ->", this);
//             return this.form.name + "-" + this.form.age;
//         },
//     },
// });

// console.log(object.getValue())
// object.form.age = 88;
// console.log(object.getValue())


export default Vue;