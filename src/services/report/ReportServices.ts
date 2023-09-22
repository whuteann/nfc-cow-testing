import { encodeQueryData, safeParse } from "@/helpers/app";
import { PaginationType } from "@/types/Common";
import { Prisma } from "@prisma/client";
import FileSaver from "file-saver";

//used fuctions
export const getCounts = async (coordinatorId, onSuccess: (result: any) => void, onError: (err: any) => void) => {
  const params = encodeQueryData({
    coordinatorId: coordinatorId
  });

  const option = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  };

  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/reports/2` + params, option)
    .then(async (res: any) => {
      if (!res.ok) {
        return Promise.reject(res);
      }

      let result = await res.json();

      onSuccess(result?.data);
    })
    .catch(error => {
      onError(error);
    });
}

export const getActiveDispersals = async (query, onSuccess: (result: any) => void, onError: (err: any) => void) => {
  const params = encodeQueryData(query);

  const option = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  };

  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/reports/3` + params, option)
    .then(async (res: any) => {
      if (!res.ok) {
        return Promise.reject(res);
      }

      let result = await res.json();

      onSuccess(result?.data);
    })
    .catch(error => {
      onError(error);
    });
}

export const getDataForReport4 = async (query, onSuccess: (result: any) => void, onError: (err: any) => void) => {
  const params = encodeQueryData(query)

  const option = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  };

  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/reports/4` + params, option)
    .then(async (res: any) => {
      if (!res.ok) {
        return Promise.reject(res);
      }

      let result = await res.json();

      onSuccess(result?.data);
    })
    .catch(error => {
      onError(error);
    });
}

export const getDataForReport6 = async (query, onSuccess: (result: any) => void, onError: (err: any) => void) => {
  const params = encodeQueryData(query)

  const option = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  };

  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/reports/6` + params, option)
    .then(async (res: any) => {
      if (!res.ok) {
        return Promise.reject(res);
      }

      let result = await res.json();

      onSuccess(result?.data);
    })
    .catch(error => {
      onError(error);
    });
}

export const getDataForReport5 = async (query, onSuccess: (results: any) => void, onError: (err: any) => void) => {
  const params = encodeQueryData(query)

  const option = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  };

  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/reports/5` + params, option)
    .then(async (res: any) => {
      if (!res.ok) {
        return Promise.reject(res);
      }

      let result = await res.json();

      onSuccess(result?.data);
    })
    .catch(error => {
      onError(error);
    }); return
}

export const generateExcelReport1 = async () => {
  try {
    const response = await fetch('/api/reports/1/excel/generate');
    
    const blob = await response.blob();

    const curr_date = new Date();

    FileSaver.saveAs(blob, `report_1_${curr_date.getTime()}.xlsx`);
  } catch (error) {
    console.error('Error generating Excel:', error);
  }
};

export const generateExcelReport2 = async (coordinatorId: string) => {
  try {
    const option = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    };

    const response = await fetch(`/api/reports/2/excel/generate/?coordinatorId=${coordinatorId}`, option);
    
    const blob = await response.blob();

    const curr_date = new Date();

    FileSaver.saveAs(blob, `report_2_${curr_date.getTime()}.xlsx`);
  } catch (error) {
    console.error('Error generating Excel:', error);
  }
};

export const generateExcelReport3 = async (query: {fromDate: string, toDate: string}) => {
  try {
    const params = encodeQueryData(query);

    const option = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    };

    const response = await fetch(`/api/reports/3/excel/generate` + params, option);
    
    const blob = await response.blob();

    const curr_date = new Date();

    FileSaver.saveAs(blob, `report_3_${curr_date.getTime()}.xlsx`);
  } catch (error) {
    console.error('Error generating Excel:', error);
  }
};

export const generateExcelReport4 = async (query: {userId: string, fromDate: string, toDate: string}) => {
  try {
    const params = encodeQueryData(query);

    const option = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    };

    const response = await fetch(`/api/reports/4/excel/generate` + params, option);
    
    const blob = await response.blob();

    const curr_date = new Date();

    FileSaver.saveAs(blob, `report_4_${curr_date.getTime()}.xlsx`);
  } catch (error) {
    console.error('Error generating Excel:', error);
  }
};

export const generateExcelReport5 = async (query: {
  countryId: string,
  farmId: string,
  villageTownId: string,
  teamLeadId: string,
  supervisorId: string,
  coordinatorId: string,
  familyId: string,
  fromDate: string,
  toDate: string
}) => {
  try {
    const params = encodeQueryData(query);

    const option = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    };

    const response = await fetch(`/api/reports/5/excel/generate` + params, option);
    
    const blob = await response.blob();

    const curr_date = new Date();

    FileSaver.saveAs(blob, `report_5_${curr_date.getTime()}.xlsx`);
  } catch (error) {
    console.error('Error generating Excel:', error);
  }
};

export const generateExcelReport6 = async (query: {
  familyIds: string,
  fromDate: string,
  toDate: string
}) => {
  try {
    const params = encodeQueryData(query);

    const option = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    };

    const response = await fetch(`/api/reports/6/excel/generate` + params, option);
    
    const blob = await response.blob();

    const curr_date = new Date();

    FileSaver.saveAs(blob, `report_6_${curr_date.getTime()}.xlsx`);
  } catch (error) {
    console.error('Error generating Excel:', error);
  }
};
