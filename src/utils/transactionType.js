const INCOMING_TYPES = ['deposit', 'transfer_in']

export const isIncoming = (transaction) => INCOMING_TYPES.includes(transaction?.type)
