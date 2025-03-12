import { useQuery } from "@tanstack/react-query";

interface IResponse {
    ID_ROTULO: number;
    OBS: string;
    CODPROD: number;
    DESCRPROD: string;
    STATUS: string;
    STATUS2: string;
    ABERTOPDI: string;
    NOMEUSU: string;
    DATA_ENVIO: string;
    DATA_FINALIZACAO: string;
    DATA_CRIACAO: string;
}

const fetchRotulos = async (): Promise<IResponse[]> => {
    const response = await JX.consultar(`
            SELECT 
            ID_ROTULO, 
            FORMAT(ROT.DATA_CRIACAO, 'dd/MM/yyyy HH:mm') AS DATA_CRIACAO, 
            ROT.ABERTOPDI, 
            ROT.CODPROD, 
            PRO.DESCRPROD, 
            ROT.STATUS, 
            ROT.CODUSU, 
            USU.NOMEUSU, 
            FORMAT(ROT.DATA_FINALIZACAO, 'dd/MM/yyyy HH:mm') AS DATA_FINALIZACAO, 
            FORMAT(ROT.DATA_ENVIO, 'dd/MM/yyyy HH:mm') AS DATA_ENVIO, 
            SANKHYA.OPTION_LABEL('AD_ROTULOS', 'STATUS', ROT.STATUS) AS STATUS2 
            FROM AD_ROTULOS AS ROT 
            INNER JOIN TGFPRO PRO ON PRO.CODPROD = ROT.CODPROD 
            INNER JOIN TSIUSU USU ON USU.CODUSU = ROT.CODUSU 
            ORDER BY DATA_FINALIZACAO DESC, DATA_ENVIO DESC, DATA_CRIACAO DESC
        `
    );
    return response;
};


export const useRotulos = () => {
    return useQuery<IResponse[], Error>({
        queryKey: ["rotulos"],
        queryFn: fetchRotulos,
        retry: false,
    });
};
