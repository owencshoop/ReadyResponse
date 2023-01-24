"""empty message

Revision ID: 1f73158f3b9d
Revises: 
Create Date: 2023-01-24 15:12:53.114575

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '1f73158f3b9d'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('addresses',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('firstAddressLine', sa.String(length=80), nullable=False),
    sa.Column('secondAddressLine', sa.String(length=80), nullable=True),
    sa.Column('city', sa.String(), nullable=False),
    sa.Column('state', sa.String(), nullable=False),
    sa.Column('zipCode', sa.String(), nullable=False),
    sa.Column('ownerName', sa.String(), nullable=True),
    sa.Column('ownerPhone', sa.String(), nullable=True),
    sa.Column('ownerEmail', sa.String(), nullable=True),
    sa.Column('ownerFirstAddressLine', sa.String(length=80), nullable=True),
    sa.Column('ownerSecondAddressLine', sa.String(length=80), nullable=True),
    sa.Column('ownerCity', sa.String(), nullable=True),
    sa.Column('ownerState', sa.String(), nullable=True),
    sa.Column('ownerZipCode', sa.String(), nullable=True),
    sa.Column('notes', sa.Text(), nullable=True),
    sa.Column('nextInspectionDate', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('inspection_types',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('type', sa.String(length=40), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('type')
    )
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(length=40), nullable=False),
    sa.Column('email', sa.String(length=255), nullable=False),
    sa.Column('hashed_password', sa.String(length=255), nullable=False),
    sa.Column('firstName', sa.String(length=255), nullable=False),
    sa.Column('lastName', sa.String(length=255), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('username')
    )
    op.create_table('question_categories',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('category', sa.String(length=255), nullable=False),
    sa.Column('inspection_type_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['inspection_type_id'], ['inspection_types.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('questions',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('question', sa.Text(), nullable=False),
    sa.Column('question_category_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['question_category_id'], ['question_categories.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('question')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('questions')
    op.drop_table('question_categories')
    op.drop_table('users')
    op.drop_table('inspection_types')
    op.drop_table('addresses')
    # ### end Alembic commands ###