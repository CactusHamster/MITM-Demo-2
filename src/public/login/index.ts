import "./index.css"
//import "./ubuntu.woff2"
let checkInput = (elem: any): elem is HTMLInputElement => {
    let r = elem instanceof HTMLInputElement;
    if (r === false) throw new Error(`Element \`${elem.id}\` is not an input element.`);
    return r;
}
let onEnter = (elem: HTMLElement, action: Function) => {
    elem.addEventListener("keydown", (e) => e.code === "Enter" ? action(e) : null)
}
;(function () {
    const userbox = document.getElementById("uname");
    const passbox = document.getElementById("passwd");
    const gobutton = document.getElementById("gobtn");
    if (!checkInput(userbox) || !checkInput(passbox) || !checkInput(gobutton)) throw new Error("Required input is not an input element.");
    if (gobutton === null) throw new Error("Element `gobtn` is null.");

    onEnter(userbox, () => passbox.focus())
    onEnter(passbox, () => gobutton.click())

    function showError (err: string | Error) {
        const errspan = document.getElementById("puterr");
        if (!errspan) throw new Error("Element `puterr` is null.");
        if (err instanceof Error) err = err.message;
        errspan.innerText = err;
    }

    let authenticating = false;
    async function checkLogin (): Promise<void> {
        if (!checkInput(userbox) || !checkInput(passbox) || !checkInput(gobutton)) throw new Error("Required input is not an input element.");
        let oldButtonText = gobutton.innerText;
        let reset = () => {
            authenticating = false;
            gobutton.disabled = false;
            gobutton.innerText = oldButtonText;
        }
        try {
            // ensure no other instances of function are running
            if (authenticating) throw new Error("");
            let email = userbox.value;
            let password = passbox.value;
            if (email === "") throw new Error("Invalid email.");
            else if (password === "") throw new Error("Invalid password.");
            authenticating = true;
            gobutton.disabled = true;
            gobutton.innerText = "Authenticating...";
            let res: Response;
            let data: any;
            try {
                res = await fetch("/api/auth", {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({
                        user: email,
                        password: password
                    })
                });
                data = await res.json();
            } catch (e) { throw new Error("Failed to contact server."); }
            reset()
            if (!res.ok) throw new Error(`[${res.status}]: ${data.message ?? "<no response>"}`);
            if (!data.token) throw new Error(data.message ?? "invalid request");
            localStorage.setItem("token", data.token)
            document.location = "/app.html"
        } catch (e) {
            reset();
            if (!(e instanceof Error) && typeof e !== "string") return console.error(e);
            showError(e);
        }
    }
    gobutton.addEventListener("click", checkLogin)
})();