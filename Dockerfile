FROM node:14 as build

WORKDIR /usr/src/app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM nginx
ADD ./nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /usr/src/app/build /usr/share/nginx/html

EXPOSE 4600

CMD ["nginx", "-g", "daemon off;"]
