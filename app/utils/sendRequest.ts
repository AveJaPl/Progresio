import { GetResponse, PostResponse } from "@/app/types/Sender";

const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export async function getData(
  url: string,
  isProtected: boolean = true
): Promise<GetResponse> {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Timezone: timezone,
    },
    credentials: isProtected ? "include" : "omit",
  });

  const data = await response.json();

  return {
    status: response.status,
    message: response.statusText,
    data,
  };
}

export async function postData(
  url: string,
  data: any,
  isProtected: boolean = true
): Promise<PostResponse> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'Timezone': timezone,
    },
    credentials: isProtected ? "include" : "omit",
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  return {
    status: response.status,
    message: response.statusText,
    data: responseData,
  };
}

export async function putData(
  url: string,
  data: any,
  isProtected: boolean = true
): Promise<PostResponse> {
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      'Timezone': timezone,
    },
    credentials: isProtected ? "include" : "omit",
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  return {
    status: response.status,
    message: response.statusText,
    data: responseData,
  };
}

export async function deleteData(
  url: string,
  isProtected: boolean = true
): Promise<GetResponse> {
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      'Timezone': timezone,
    },
    credentials: isProtected ? "include" : "omit",
  });

  const data = await response.json();

  return {
    status: response.status,
    message: response.statusText,
    data,
  };
}
