import express, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import fs from 'node:fs/promises';
import { handleUnknownError } from '../utils/controller-utils';
import Call from '../interfaces/call.interface';
import Lead from '../interfaces/lead.interface';
import Person from '../interfaces/person.interface';
import SalesActivity from '../interfaces/sales-activity.interface';

const loadData = async <T>(filename: string) => {
  const filePath = `./data/${filename}`;
  const fileData = await fs.readFile(filePath);
  const result: T[] = JSON.parse(fileData.toString());
  return result;
};

const filterLeadByCalls = (
  calls: Call[],
  outcomeReached: boolean,
  leadProperty: string
): boolean => {
  return calls
    .filter(
      (c) =>
        c.collectionName === 'Property' &&
        (!outcomeReached || c.outcome === 'reached')
    )
    .map((c) => c.itemId)
    .includes(leadProperty);
};

const getSalesActivityForOnePerson = (
  person: Person,
  leads: Lead[],
  calls: Call[]
): SalesActivity => {
  const personLeads = leads.filter(
    (l) => l.salesAssistantPersonId === person._id
  );
  const personNewLeads = personLeads.filter((l) =>
    ['new', 'fresh'].includes(l.status)
  );

  const personCalls = calls.filter((c) => c.creator === person._id);

  const personLeadsCalled = personLeads.filter((l) =>
    filterLeadByCalls(personCalls, false, l.property)
  );
  const personLeadsReached = personLeads.filter((l) =>
    filterLeadByCalls(personCalls, true, l.property)
  );

  const salesActivity: SalesActivity = {
    firstName: person.firstname,
    leads: personLeads.length,
    newLeads: personNewLeads.length,
    calls: personCalls.length,
    leadsCalled: personLeadsCalled.length,
    leadsReached: personLeadsReached.length
  };

  return salesActivity;
};

export const getSalesActivity = async (
  request: Request,
  response: Response,
  next: express.NextFunction
): Promise<void> => {
  try {
    const calls = await loadData<Call>('Call.json');
    const leads = await loadData<Lead>('Lead.json');
    const persons = await loadData<Person>('Person.json');

    const leadsPersonsIdentifiers = new Set(
      leads.map((l) => l.salesAssistantPersonId)
    );
    const callsPersonsIdentifiers = new Set(calls.map((c) => c.creator));
    const personsIdentifiers = [
      ...new Set([...leadsPersonsIdentifiers, ...callsPersonsIdentifiers])
    ];

    const salesActivities: SalesActivity[] = [];
    for (const personId of personsIdentifiers) {
      const person = persons.find((p) => p._id === personId);
      if (!person) {
        continue;
      }

      const salesActivity = getSalesActivityForOnePerson(person, leads, calls);

      salesActivities.push(salesActivity);
    }

    const salesActivitiesSorted = salesActivities.sort((sa1, sa2) => {
      if (sa1.leads > sa2.leads) {
        return -1;
      }

      if (sa1.leads < sa2.leads) {
        return 1;
      }

      return 0;
    });

    console.table(salesActivitiesSorted);
    response.status(StatusCodes.OK).json({
      status: response.statusCode,
      data: salesActivitiesSorted
    });
  } catch (error: unknown) {
    handleUnknownError(error, next);
    return;
  }
};
