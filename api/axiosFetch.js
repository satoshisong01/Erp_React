import axios from "axios";

import CODE from "constants/code";

function handleAxiosError(error) {
    if (!error.response) {
        alert("서버와의 연결에 실패했습니다.");
        console.log(error);
    } else if (error.response.status >= 400 && error.response.status < 500) {
        alert("서버통신 에러: 클라이언트 오류가 발생했습니다.");
    } else if (error.response.status >= 500) {
        alert("서버통신 에러: 서버 내부 오류가 발생했습니다.");
    } else {
        alert("알 수 없는 오류가 발생했습니다.");
    }
}

/* axios 데이터 통신 */
export async function axiosFetch(url, requestData) {
    const headers = {
        Authorization: localStorage.jToken,
        "Content-Type": "application/json",
    };

    try {
        const response = await axios.post(url, requestData, { headers });
        if (Number(response.data.resultCode) === Number(CODE.RCV_SUCCESS)) {
            return response.data.result.resultData;
        } else {
            console.error("❌axiosFetch error: ", response);
            return false;
        }
    } catch (error) {
        //handleAxiosError(error);
        throw error;
    }
}

// 업로드하기
export async function axiosFileUpload(url, files) {
    const headers = {
        Authorization: localStorage.jToken,
    };

    try {
        const formData = new FormData();

        // 모든 파일을 FormData에 추가
        files.forEach((file) => {
            formData.append(`attachFile`, file);
        });

        const response = await axios.post(url, formData, { headers });

        if (Number(response.data.resultCode) === Number(CODE.RCV_SUCCESS)) {
            return response.data.result.resultData;
        } else {
            console.error("❌axiosFileUpload error: ", response);
            return false;
        }
    } catch (error) {
        //handleAxiosError(error);
        throw error;
    }
}

// 업로드(추가)하기
export async function axiosFileAddUpload(url, files, fileIdData) {
    try {
        const formData = new FormData();

        console.log(files);
        console.log(fileIdData);

        // 모든 파일을 FormData에 추가
        files.forEach((file) => {
            formData.append("attachFile", file);
        });
        formData.append("attachFileId", fileIdData);

        // attachFileId를 FormData에 추가
        //formData.append("attachFileId", fileIdData);

        const headers = {
            Authorization: localStorage.jToken,
            "Content-Type": "text/plain",
        };

        const response = await axios.post(url, formData, {
            headers: headers,
        });

        if (Number(response.data.resultCode) === Number(CODE.RCV_SUCCESS)) {
            return response.data.result.resultData;
        } else {
            console.error("❌axiosFileUpload error: ", response);
            return false;
        }
    } catch (error) {
        //handleAxiosError(error);
        throw error;
    }
}

/* axios 데이터 업데이트 */
export async function axiosUpdate(url, requestData) {
    const headers = {
        Authorization: localStorage.jToken,
        "Content-Type": "application/json",
    };

    try {
        const response = await axios.put(url, requestData, { headers });
        if (Number(response.data.resultCode) === Number(CODE.RCV_SUCCESS)) {
            return response.data.result.resultData;
        } else {
            console.error("❌axiosUpdate error: ", response);
            return false;
        }
    } catch (error) {
        //handleAxiosError(error);
        throw error;
    }
}

/* axios 데이터 삭제 */
export async function axiosDelete(url, requestData) {
    const headers = {
        Authorization: localStorage.jToken,
        "Content-Type": "application/json",
    };

    try {
        const response = await axios.delete(url, {
            headers: headers,
            data: requestData, // 요청 페이로드로 requestData를 설정
        });
        if (Number(response.data.resultCode) === Number(CODE.RCV_SUCCESS)) {
            return response.data.result.resultData;
        } else {
            console.error("❌axiosDelete error: ", response);
            return false;
        }
    } catch (error) {
        //handleAxiosError(error);
        throw error;
    }
}

/* axios 데이터 추가하기 */
export async function axiosPost(url, requestData) {
    const headers = {
        Authorization: localStorage.jToken,
        "Content-Type": "application/json",
    };

    try {
        const response = await axios.post(url, requestData, { headers });
        if (Number(response.data.resultCode) === Number(CODE.RCV_SUCCESS)) {
            return response.data.result.resultData;
        } else {
            console.error("axiosPost error: ", response);
            return false;
        }
    } catch (error) {
        console.error("❌server error: ", error);
        //handleAxiosError(error);
        throw error;
    }
}

export async function axiosPostPersonel(url, requestData) {
    const headers = {
        Authorization: localStorage.jToken,
        "Content-Type": "application/json",
    };

    try {
        if (requestData === true) {
            const results = [];

            for (let i = 2; i <= 14; i++) {
                const data = {
                    gupDesc: "123",
                    gupId: (16 - i).toString(), // 2부터 14까지 13번 반복하여 -1씩 감소
                    gupPrice: "0",
                    gupType: "P",
                    guppId: i.toString(), // 2부터 14까지 반복
                    lockAt: "Y",
                    userAt: "Y",
                };

                const response = await axios.post(url, data, { headers });
                if (Number(response.data.resultCode) === Number(CODE.RCV_SUCCESS)) {
                    console.log(response.data.resultCode);
                    results.push(response.data.result.resultData);
                } else {
                    results.push(response.data);
                }
            }

            return results; // 모든 요청이 완료된 후에 결과를 반환
        } else {
            const response = await axios.post(url, requestData, { headers });
            if (Number(response.data.resultCode) === Number(CODE.RCV_SUCCESS)) {
                console.log(response.data.resultCode);
                return response.data.result.resultData;
            } else {
                return Number(response.data.resultCode);
            }
        }
    } catch (error) {
        console.error("server error: ", error);
        //handleAxiosError(error);
        throw error;
    }
}

/* axios 데이터 검색하기 */
export async function axiosScan(url, requestData) {
    const headers = {
        Authorization: localStorage.jToken,
        "Content-Type": "application/json",
    };

    try {
        const response = await axios.post(url, requestData, { headers });
        if (Number(response.data.resultCode) === Number(CODE.RCV_SUCCESS)) {
            return response.data.result.resultData;
        } else {
            return response.data;
        }
    } catch (error) {
        //handleAxiosError(error);
        console.error("server error: ", error);
        throw error;
    }
}

//다운로드

export async function axiosDownLoad(downloadUrl, requestData) {
    const headers = {
        Authorization: localStorage.jToken,
        "Content-Type": "application/json",
    };

    try {
        const response = await axios.post(downloadUrl, requestData, {
            headers,
            responseType: "blob", // 바이너리 데이터로 응답 받기
        });

        // 서버 응답 헤더에서 파일명 가져오기
        const contentDisposition = response.headers["content-disposition"];
        const fileName = contentDisposition.split("filename=")[1].trim();

        // 파일 다운로드를 위한 코드
        const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = blobUrl;
        link.setAttribute("download", fileName || "downloadedFile"); // 파일명이 없으면 'downloadedFile'으로 설정
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        return true;
    } catch (error) {
        //handleAxiosError(error);
        console.error("❌axiosDownLoad 에러: ", error);
        throw error;
    }
}

/* get */
export async function axiosGet(url) {
    const headers = {
        Authorization: localStorage.jToken,
        "Content-Type": "application/json",
    };

    try {
        const response = await axios.get(url, { headers });
        if (Number(response.data.resultCode) === Number(CODE.RCV_SUCCESS)) {
            return true;
        } else {
            console.error("❌axiosGet error: ");
            return false;
        }
    } catch (error) {
        //handleAxiosError(error);
        throw error;
    }
}
