import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { DataOnline } from '../express/dal/data.online';
import { Client } from './entity/Client';
import { Policy } from './entity/Policy';

createConnection().then(async connection => {
  const dataOnline = new DataOnline();
  const clients: any[] = await (dataOnline.get('http://www.mocky.io/v2/5808862710000087232b75ac', 'clients'));
  await connection.getRepository(Client).save(clients.map<any>(x => { return { srcId: x.id, name: x.name, email: x.email, role: x.role }}));
  const policies: any[] = await (dataOnline.get('http://www.mocky.io/v2/580891a4100000e8242b75c5', 'policies'));
  await connection.getRepository(Policy).save(policies.map<any>(x => { return { srcId: x.id, amountInsuted: x.amountInsuted, email: x.email, inceptionDate: x.inceptionDate, installmentPayment: x.installmentPayment, clientId: x.clientId }}));
  console.log('yeah');
});
