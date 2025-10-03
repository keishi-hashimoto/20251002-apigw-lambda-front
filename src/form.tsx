import React, { useState } from "react"
import ky from "ky"

type Response = {
    message: string;
    user_info: {
        username: string;
        email: string
    }
}

const submitUserData = async (username: string, email: string) => {
    const url = process.env.BUN_PUBLIC_API_GATEWAY_ENDPOINT
    if (url === undefined) {
        throw new Error("API Gateway の URL が設定されていません")
    }
    const json = { username, email }
    const headers = { "Content-Type": "application/json" }
    console.log(`json`)
    console.log(json)
    try {
        const response = await ky.post(url, { json, headers }).json<Response>()
        console.log(response)
        return response
    } catch (e) {
        console.log(e)
        throw new Error(`ユーザー情報の登録に失敗しました: ${e}`)
    }
}

export function Form() {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [disabled, setDisabled] = useState(false)

    const submit = async () => {
        setDisabled(true)
        try {
            await submitUserData(username, email)
            window.alert(`ユーザー情報を登録しました (ユーザー名: ${username}、メールアドレス: ${email})`)
        } catch (e) {
            window.alert(e)
        }
        setUsername("")
        setEmail("")
        setDisabled(false)
    }

    const usernameOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value)
    }

    const emailOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
    }

    return (
        // <form>
        <>
            <div>
                <label>ユーザー名</label>
                <input type="text" name="username" id="username" value={username} onChange={usernameOnChange} required />
            </div>
            <div>
                <label>メールアドレス</label>
                <input type="text" name="email" id="email" value={email} onChange={emailOnChange} required />
            </div>
            <button type="button" disabled={disabled} onClick={submit}>登録</button>
        </>
        // {/* </form> */}
    )
}
