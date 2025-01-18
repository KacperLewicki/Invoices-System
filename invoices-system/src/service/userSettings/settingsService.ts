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

            return { success: true, message: 'Password changed successfully.' };

        } else {

            return { success: false, message: data.message || 'An error occurred while changing the password.' };
        }

    } catch (error) {

        console.error('Error while changing password:', error);
        return { success: false, message: 'An error occurred while changing the password.' };
    }
};
