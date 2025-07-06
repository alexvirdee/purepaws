export function formatPrice(amount: number): string {
    if (isNaN(amount)) return "$0";

    return `$${amount.toLocaleString("en-US")}`;
}