export interface ChangePasswordResponse {

    success: boolean;
    message: string;
}

export const changePassword = async (

    currentPassword: string,
    newPassword: string

): Promise<ChangePasswordResponse> => {

    try {

        const res = await fetch('/api/postChangePassword', {

            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ currentPassword, newPassword }),
        });

        const data = await res.json();

        if (res.ok) {

            return { success: true, message: 'Hasło zmienione pomyślnie.' };

        } else {

            return { success: false, message: data.message || 'Wystąpił błąd podczas zmiany hasła.' };
        }

    } catch (error) {

        console.error('Błąd podczas zmiany hasła:', error);
        return { success: false, message: 'Wystąpił błąd podczas zmiany hasła.' };
    }
};
