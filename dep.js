class Dep {
    constructor() {
        this.subs = [];
    }
    static target = null;
    depend() {
        if (!Dep.target) { return }
        if (!this.subs.includes(Dep.target)) {
            this.subs.push(Dep.target);
        }
    }
    notify() {
        // console.log(6, this.subs)
        this.subs.forEach((item) => {
            const { key, func, instance } = item;
            const result = func();

            instance[key] = result;
            // console.log(key, result)
        });
    }
}


export default Dep;