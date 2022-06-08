import React, { useCallback, useEffect, useState } from "react";

import { Transfer, getTransfers } from "api/transfers";
import { useQuery } from "react-query";

import { Button, Loader, Typography } from "ui/atoms";
import { DropdownField, TextField, ButtonList } from "ui/molecules";
import { TransfersListing } from "./TransfersListing";
import { AccountHistoryLayout } from "./styled";

export const AccountHistory: React.FC = () => {
  const [page, setPage] = useState(1);
  const { isLoading, isSuccess, isError, data: transfers } = useQuery<Transfer[]>(
    ["transfers", page],
    () => getTransfers(page),
    {
      staleTime: 5000,
      cacheTime: 120000,
    }
  );

  if (isLoading) return <Loader />;

  return (
    <>
      <Typography variant="h1">Historia konta</Typography>
      <AccountHistoryLayout>
        <div>
          <TransfersListing transfers={isSuccess ? transfers : []} />
          <ButtonList align="center">
            <Button variant="SECONDARY" disabled>
              Późniejsze
            </Button>
            <Button onClick={() => setPage(_page => _page + 1)} variant="SECONDARY">Wcześniejsze</Button>
          </ButtonList>
        </div>
        <div>
          <Typography variant="h3">Filtry</Typography>
          <DropdownField
            id="transaction_date"
            label="Data"
            layoutDirection="vertical"
            items={{
              0: "Ostatni tydzień",
              1: "Ostatnie 30 dni",
              2: "Ostatnie 90 dni",
              3: "Inna data",
            }}
          />
          <TextField
            id="transaction_title"
            label="Opis transakcji"
            layoutDirection="vertical"
          />
          <ButtonList>
            <Button variant="PRIMARY">Szukaj</Button>
            <Button variant="SECONDARY">Lista wyciągów</Button>
          </ButtonList>
        </div>
      </AccountHistoryLayout>
    </>
  );
};
